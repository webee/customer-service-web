import { routerRedux } from "dva/router";
import { collectTypeReducers, createNSSubEffectFunc, listToDict } from "../utils";
import * as projectService from "../../services/project";
import * as msgCodecService from "../../services/msgCodec";
import * as msgCookService from "../../services/msgCook";
import { newSingletonContext } from "../../utils/notify";
import { asYieldFunc } from "../../utils/commons";

const ns = "_";
const msgTypeInitialStatus = {
  raw: "pending",
  ripe: "ready"
};

const CURRENT_SESSION_START_MSG = { domain: "system", type: "divider", msg: "当前会话开始" };

// reducers
export const reducer = collectTypeReducers(
  {
    // 所有会话by id
    sessions: {},
    // 所有项目by id
    projects: {},
    // 项目消息by project id: {lid, rid, [msgs], noMore, isFetchingNew, isFetchingHistory}
    projectMsgs: {},
    // tx_id, 每次自增1
    tx_id: 0,
    // 项目发送中的消息by tx_id
    txMsgs: {},
    // 发送id的id列表
    txMsgIDs: [],
    // 项目发送消息id列表by project id: [tx_id...]
    projectTxMsgIDs: {}
  },
  {
    updateSessionSyncMsgID(state, { payload: { id, sync_msg_id } }) {
      const curSession = state.sessions[id];
      if (!curSession) {
        return state;
      }
      const sessions = { [id]: { ...curSession, sync_msg_id } };
      return { ...state, sessions: { ...state.sessions, ...sessions } };
    },
    updateSessions(state, { payload: sessionList }) {
      const sessions = listToDict(sessionList, o => o.id);
      for (let id in sessions) {
        // 保持本地更新的sync_msg_id
        const s = sessions[id];
        const sCur = state.sessions[s.id];
        if (sCur && sCur.sync_msg_id > s.sync_msg_id) {
          s.sync_msg_id = sCur.sync_msg_id;
        }
      }
      return { ...state, sessions: { ...state.sessions, ...sessions } };
    },
    removeSession(state, { payload: id }) {
      const sessions = { ...state.sessions };
      delete sessions[id];
      return { ...state, sessions };
    },
    updateProjects(state, { payload: projectList }) {
      const projects = listToDict(projectList, o => o.id);
      return { ...state, projects: { ...state.projects, ...projects } };
    },
    clearProjectMsgs(state, { payload: id }) {
      const projectMsgs = { ...state.projectMsgs };
      delete projectMsgs[id];
      return { ...state, projectMsgs };
    },
    updateProjectMsgsIsFetching(state, { payload: { id, isFetchingNew, isFetchingHistory } }) {
      const projectMsgs = { ...state.projectMsgs };
      projectMsgs[id] = { ...(projectMsgs[id] || {}) };
      if (isFetchingNew !== undefined) {
        projectMsgs[id].isFetchingNew = isFetchingNew;
      }
      if (isFetchingHistory !== undefined) {
        projectMsgs[id].isFetchingHistory = isFetchingHistory;
      }
      return { ...state, projectMsgs };
    },
    appendProjectMsgs(state, { payload: { id, msgs } }) {
      const projectMsgs = { ...state.projectMsgs };
      let { lid, rid, msgs: _msgs, noMore } = projectMsgs[id] || {};
      _msgs = _msgs || [];
      let newMsgs = [..._msgs];
      msgs.forEach(msg => {
        if (!lid) {
          lid = msg.msg_id;
        }

        if (!rid || msg.msg_id > rid) {
          rid = msg.msg_id;
          newMsgs.push({ ...msg, is_rx: true });
        } else if (msg.is_failed) {
          newMsgs.push({ ...msg, is_rx: true });
        }
      });
      projectMsgs[id] = { lid, rid, msgs: newMsgs, noMore };
      return { ...state, projectMsgs };
    },
    insertProjectMsgs(state, { payload: { id, msgs, noMore } }) {
      const project = state.projects[id];
      const session = state.sessions[project.current_session_id] || {};
      const projectMsgs = { ...state.projectMsgs };
      let { lid, rid, msgs: _msgs, noMore: _noMore } = projectMsgs[id] || {};
      _msgs = _msgs || [];
      const newNoMore = noMore === undefined ? _noMore : noMore;
      let newMsgs = [..._msgs];
      msgs.forEach(msg => {
        if (!lid || msg.msg_id < lid) {
          lid = msg.msg_id;
          if (lid === session.start_msg_id) {
            newMsgs.unshift(CURRENT_SESSION_START_MSG);
          }
          newMsgs.unshift({ ...msg, is_rx: true });
        }

        if (!rid) {
          rid = msg.msg_id;
        }
      });
      projectMsgs[id] = { lid, rid, msgs: newMsgs, noMore: newNoMore };
      return { ...state, projectMsgs };
    },
    removeProjMsgs(state, { payload: id }) {
      const projectMsgs = { ...state.projectMsgs };
      delete projectMsgs[id];
      return { ...state, projectMsgs };
    },
    removeProjectMsg(state, { payload: { id, msg_id } }) {
      const projectMsgs = { ...state.projectMsgs };
      const projMsgs = projectMsgs[id] || { msgs: [] };
      projectMsgs[id] = { ...projMsgs, msgs: projMsgs.msgs.filter(m => m.msg_id !== msg_id) };
      return { ...state, projectMsgs };
    },
    addTxMsg(state, { payload: { project_id, session_id, msgType, ...txMsg } }) {
      if (!(msgType === "ripe" || msgType === "raw")) {
        return state;
      }

      const tx_id = state.tx_id + 1;
      const msg_id = -tx_id;
      const is_tx = true;
      const status = msgTypeInitialStatus[msgType];
      const ts = Math.round(new Date().getTime() / 1000);
      txMsg = { ...txMsg, tx_id, msg_id, project_id, session_id, is_tx, status, msgType, ts };

      const txMsgs = { ...state.txMsgs, [tx_id]: txMsg };
      const txMsgIDs = [...state.txMsgIDs, tx_id];
      const projTxMsgIDs = [...(state.projectTxMsgIDs[project_id] || []), tx_id];
      const projectTxMsgIDs = { ...state.projectTxMsgIDs, [project_id]: projTxMsgIDs };

      return { ...state, tx_id, txMsgs, txMsgIDs, projectTxMsgIDs };
    },
    markTxMsgAsHandled(state, { payload: tx_id }) {
      const txMsgIDs = state.txMsgIDs.filter(id => id !== tx_id);
      return { ...state, txMsgIDs };
    },
    markTxMsgAsFailed(state, { payload: { projectID, tx_id } }) {
      const txMsgIDs = state.txMsgIDs.filter(id => id !== tx_id);
      const txMsgs = { ...state.txMsgs };
      delete txMsgs[tx_id];
      const projTxMsgIDs = (state.projectTxMsgIDs[projectID] || []).filter(id => id !== tx_id);
      const projectTxMsgIDs = { ...state.projectTxMsgIDs, [projectID]: projTxMsgIDs };
      return { ...state, txMsgs, txMsgIDs, projectTxMsgIDs };
    },
    updateTxMsg(state, { payload: { tx_id, ...attrs } }) {
      const txMsgs = { ...state.txMsgs };
      txMsgs[tx_id] = { ...txMsgs[tx_id], ...attrs };

      return { ...state, txMsgs };
    },
    updateTxMsgCookingProgress(state, { payload: { tx_id, p } }) {
      const txMsgs = { ...state.txMsgs };
      const txMsg = { ...txMsgs[tx_id] };
      txMsg.state = { ...(txMsg.state || {}), p };
      txMsgs[tx_id] = txMsg;

      return { ...state, txMsgs };
    },
    checkProjectTxMsgsRxKey(state, { payload: { projectID, tx_id, rid = 0 } }) {
      const projMsgs = state.projectMsgs[projectID];
      if (projMsgs.rid && projMsgs.rid <= rid) {
        return state;
      }

      const msgs = projMsgs.msgs || [];
      const txMsgs = { ...state.txMsgs };
      const toCheckTsMsgIDs = (state.projectTxMsgIDs[projectID] || []).filter(id => (tx_id ? tx_id === id : true));
      const rxTxMsgsIDs = [];
      for (let i = msgs.length - 1; i >= 0; i--) {
        const msg = msgs[i];
        if (msg.msg_id <= rid) {
          break;
        }
        rxTxMsgsIDs.push(
          ...toCheckTsMsgIDs.filter(id => {
            const txMsg = txMsgs[id];
            return txMsg.rx_key === msg.rx_key;
          })
        );
      }
      rxTxMsgsIDs.forEach(tx_id => {
        delete txMsgs[tx_id];
      });
      const projTxMsgIDs = (state.projectTxMsgIDs[projectID] || []).filter(id => rxTxMsgsIDs.indexOf(id) < 0);
      const projectTxMsgIDs = { ...state.projectTxMsgIDs, [projectID]: projTxMsgIDs };
      return { ...state, txMsgs, projectTxMsgIDs };
    }
  }
);

// effects
export const effectFunc = createNSSubEffectFunc(ns, {
  *loadProjectHistoryMsgs(
    { projectDomain, projectType, createAction, payload: { projectID, limit = 256 } },
    { select, call, put }
  ) {
    try {
      yield put(createAction(`_/updateProjectMsgsIsFetching`, { id: projectID, isFetchingHistory: true }));
      const projectMsgs = yield select(state => state.project[projectDomain][projectType]._.projectMsgs);
      const projectMsg = projectMsgs[projectID] || {};
      if (projectMsg.noMore) {
        return;
      }

      const { lid } = projectMsg;
      const { msgs, no_more } = yield call(projectService.fetchProjectMsgs, projectID, {
        rid: lid,
        limit,
        desc: true
      });
      const noMore = no_more || (limit > 0 && msgs.length == 0);
      const decodedMsgs = msgs.map(msg => ({ ...msg, ...msgCodecService.decodeMsg(msg) }));
      yield put(createAction(`_/insertProjectMsgs`, { id: projectID, msgs: decodedMsgs, noMore }));
    } finally {
      yield put(createAction(`_/updateProjectMsgsIsFetching`, { id: projectID, isFetchingHistory: false }));
    }
  },
  *fetchProjectNewMsgs({ projectDomain, projectType, createAction, payload: { projectID } }, { select, call, put }) {
    try {
      yield put(createAction(`_/updateProjectMsgsIsFetching`, { id: projectID, isFetchingNew: true }));
      const projectMsgs = yield select(state => state.project[projectDomain][projectType]._.projectMsgs);
      const projectMsg = projectMsgs[projectID] || {};
      const { rid } = projectMsg;
      let limit = undefined;
      if (!rid) {
        limit = 256;
      }
      const { msgs, no_more } = yield call(projectService.fetchProjectMsgs, projectID, {
        lid: rid,
        limit
      });
      const decodedMsgs = msgs.map(msg => ({ ...msg, ...msgCodecService.decodeMsg(msg) }));
      if (!rid) {
        const noMore = no_more || (limit > 0 && msgs.length == 0);
        yield put(createAction(`_/insertProjectMsgs`, { id: projectID, msgs: decodedMsgs, noMore }));
      } else {
        yield put(createAction(`_/appendProjectMsgs`, { id: projectID, msgs: decodedMsgs }));
      }
      // 检查刚接收的消息是否为已发送状态的tx消息
      yield put(createAction(`_/checkProjectTxMsgsRxKey`, { projectID, rid }));
    } finally {
      yield put(createAction(`_/updateProjectMsgsIsFetching`, { id: projectID, isFetchingNew: false }));
    }
  },
  *tryHandleProject({ payload: projectID }, { call, put }) {
    const { domain, type, current_session_id } = yield call(projectService.tryHandleProject, projectID);
    yield put(routerRedux.push(`/projects/${domain}/${type}/my_handling?session_id=${current_session_id}`));
  },
  *fetchProjectExtData({ createAction, payload: projectID }, { call }) {
    yield call(projectService.fetchProjectExtData, projectID);
  },
  *syncSessionMsgID({ createAction, payload: { projectID, sessionID, sync_msg_id } }, { call }) {
    yield call(projectService.syncSessionMsgID, projectID, sessionID, sync_msg_id);
  },
  *sendMsg(
    {
      createAction,
      createEffectAction,
      payload: { projectID: project_id, sessionID: session_id, domain, type, msg, msgType = "ripe", state = {} }
    },
    { select, call, put }
  ) {
    const staff = yield select(state => state.app.staff);
    const user_type = "staff";
    const user_id = staff.uid;
    yield put(
      createAction(`_/addTxMsg`, { project_id, session_id, user_type, user_id, domain, type, msg, msgType, state })
    );
    yield put(createEffectAction(`_/handleTxMsgs`, { msgType, status: msgTypeInitialStatus[msgType] }));
  },
  *resendFailedMsg(
    { createAction, createEffectAction, payload: { projectID: project_id, sessionID: session_id, msg } },
    { select, call, put }
  ) {
    if (msg.is_failed) {
      yield put(
        createAction(`_/addTxMsg`, {
          project_id,
          session_id,
          ...msg,
          is_failed: undefined,
          rx_key: undefined,
          state: {
            ...(msg.state || {}),
            // p是规定好的表示cooking进度的状态量
            p: undefined
          }
        })
      );
      yield put(createAction(`_/removeProjectMsg`, { id: project_id, msg_id: msg.msg_id }));
      const { msgType } = msg;
      yield put(createEffectAction(`_/handleTxMsgs`, { msgType, status: msgTypeInitialStatus[msgType] }));
    }
  },
  *handleTxMsgs(
    { projectDomain, projectType, createAction, createEffectAction, payload: { msgType, status } },
    effects
  ) {
    const singletonContext = newSingletonContext([projectDomain, projectType, "handleTxMsgs", msgType, status]);
    if (singletonContext.start()) {
      const { select, fork, call, put } = effects;
      do {
        try {
          while (true) {
            const { txMsgs, txMsgIDs, projectMsgs } = yield select(
              state => state.project[projectDomain][projectType]._
            );
            const filteredTxMsgIDs = txMsgIDs.filter(tx_id => {
              const txMsg = txMsgs[tx_id];
              return (txMsg && txMsg.msgType === msgType && txMsg.status === status) || txMsg.status === "failed";
            });
            if (filteredTxMsgIDs.length <= 0) {
              break;
            }
            const tx_id = filteredTxMsgIDs[0];
            const txMsg = txMsgs[tx_id];
            if (!txMsg) {
              yield put(createAction(`_/markTxMsgAsHandled`, tx_id));
              continue;
            }

            const { project_id: projectID, session_id: sessionID } = txMsg;
            if (txMsg.status === "failed") {
              yield put(createAction(`_/appendProjectMsgs`, { id: projectID, msgs: [{ ...txMsg, is_failed: true }] }));
              yield put(createAction(`_/markTxMsgAsFailed`, { projectID, tx_id }));
            } else if (txMsg.msgType === "ripe") {
              yield put(createAction(`_/updateTxMsg`, { tx_id, status: "sending" }));
              yield call(handleRipeMsg, { projectMsgs, txMsg, createAction, createEffectAction }, effects);
            } else if (txMsg.msgType === "raw") {
              yield put(createAction(`_/updateTxMsg`, { tx_id, status: "cooking" }));
              yield fork(handleRawMsg, { txMsg, createAction, createEffectAction }, effects);
            }
          }
        } catch (err) {
          singletonContext.stop();
          throw err;
        }
      } while (singletonContext.is_pending());
    }
  }
});

function* handleRipeMsg({ projectMsgs, txMsg, createAction }, { call, put }) {
  const { domain, type, msg, tx_id, project_id: projectID, session_id: sessionID } = txMsg;
  const projMsgs = projectMsgs[projectID];
  try {
    const { rx_key, ts } = yield call(
      projectService.sendSessionMsg,
      projectID,
      sessionID,
      msgCodecService.encodeMsg({
        domain,
        type,
        msg
      })
    );
    yield put(createAction(`_/markTxMsgAsHandled`, tx_id));
    yield put(createAction(`_/updateTxMsg`, { tx_id, rx_key, ts, status: "syncing" }));
    yield put(createAction(`_/checkProjectTxMsgsRxKey`, { projectID, tx_id, rid: projMsgs.rid }));
  } catch (err) {
    console.error(err);
    yield put(createAction(`_/updateTxMsg`, { tx_id, status: "failed" }));
  }
}

function* handleRawMsg({ txMsg, createAction, createEffectAction }, { call, put }) {
  const { tx_id, state } = txMsg;
  try {
    const cookedTxMsg = yield call(msgCookService.cookTxMsg, txMsg, { createAction });
    const { msgType } = cookedTxMsg;
    cookedTxMsg.status = msgTypeInitialStatus[msgType];
    yield put(createAction(`_/updateTxMsg`, cookedTxMsg));
    yield put(createEffectAction(`_/handleTxMsgs`, cookedTxMsg));
  } catch (err) {
    console.error(err);
    yield put(createAction(`_/updateTxMsg`, { tx_id, status: "failed", state: { ...state, p: undefined } }));
    const { msgType, status } = txMsg;
    yield put(createEffectAction(`_/handleTxMsgs`, { msgType, status }));
  }
}
