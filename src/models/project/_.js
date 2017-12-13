import { collectTypeReducers, createNSSubEffectFunc, listToDict } from "../utils";
import * as projectService from "../../services/project";
import * as msgCodecService from "../../services/msgCodec";
import { newSingletonContext } from "../../utils/notify";
import { asYieldFunc } from "../../utils/commons";

const ns = "_";

// reducers
export const reducer = collectTypeReducers(
  {
    // 所有会话by id
    sessions: {},
    // 所有项目by id
    projects: {},
    // 项目消息by project id: {lid, rid, [msgs], noMore}
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
    appendProjectMsgs(state, { payload: { id, msgs } }) {
      const projectMsgs = { ...state.projectMsgs };
      let { lid, rid, msgs: _msgs } = projectMsgs[id] || { msgs: [] };
      let newMsgs = [..._msgs];
      msgs.forEach(msg => {
        if (!lid) {
          lid = msg.msg_id;
        }

        if (!rid || msg.msg_id > rid) {
          rid = msg.msg_id;
          newMsgs.push(msg);
        } else if (msg.is_failed) {
          newMsgs.push(msg);
        }
      });
      projectMsgs[id] = { lid, rid, msgs: newMsgs };
      return { ...state, projectMsgs };
    },
    insertProjectMsgs(state, { payload: { id, msgs, noMore } }) {
      const projectMsgs = { ...state.projectMsgs };
      let { lid, rid, msgs: _msgs, noMore: _noMore } = projectMsgs[id] || { msgs: [] };
      const newNoMore = noMore === undefined ? _noMore : noMore;
      let newMsgs = [..._msgs];
      msgs.forEach(msg => {
        if (!lid || msg.msg_id < lid) {
          lid = msg.msg_id;
          newMsgs.unshift(msg);
        }

        if (!rid) {
          rid = msg.msg_id;
        }
      });
      projectMsgs[id] = { lid, rid, msgs: newMsgs, noMore: newNoMore };
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
      const status = msgType === "ripe" ? "ready" : "pending";
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
    { projectDomain, projectType, createAction, payload: { projectID, limit } },
    { select, call, put }
  ) {
    const projectMsgs = yield select(state => state.project[projectDomain][projectType]._.projectMsgs);
    const { lid } = projectMsgs[projectID] || {};
    const { msgs } = yield call(projectService.fetchProjectMsgs, projectID, {
      rid: lid,
      limit,
      desc: true
    });
    const noMore = limit > 0 && msgs.length == 0;
    const decodedMsgs = msgs.map(msg => ({ ...msg, ...msgCodecService.decodeMsg(msg) }));
    yield put(createAction(`_/insertProjectMsgs`, { id: projectID, msgs: decodedMsgs, noMore }));
  },
  *fetchProjectNewMsgs(
    { projectDomain, projectType, createAction, payload: { projectID, limit } },
    { select, call, put }
  ) {
    const projectMsgs = yield select(state => state.project[projectDomain][projectType]._.projectMsgs);
    const { rid } = projectMsgs[projectID] || {};
    const { msgs } = yield call(projectService.fetchProjectMsgs, projectID, {
      lid: rid,
      limit
    });
    const decodedMsgs = msgs.map(msg => ({ ...msg, ...msgCodecService.decodeMsg(msg) }));
    if (!rid) {
      yield put(createAction(`_/insertProjectMsgs`, { id: projectID, msgs: decodedMsgs }));
    } else {
      yield put(createAction(`_/appendProjectMsgs`, { id: projectID, msgs: decodedMsgs }));
    }
    // 检查刚接收的消息是否为已发送状态的tx消息
    yield put(createAction(`_/checkProjectTxMsgsRxKey`, { projectID, rid }));
  },
  *syncSessionMsgID({ createAction, payload: { projectID, sessionID, sync_msg_id } }, { select, call, put }) {
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
    yield put(createEffectAction(`_/handleTxMsgs`));
  },
  *resendFailedMsg(
    { createAction, createEffectAction, payload: { projectID: project_id, sessionID: session_id, msg } },
    { select, call, put }
  ) {
    if (msg.is_failed) {
      yield put(
        createAction(`_/addTxMsg`, { project_id, session_id, ...msg, is_failed: undefined, rx_key: undefined })
      );
      yield put(createAction(`_/removeProjectMsg`, { id: project_id, msg_id: msg.msg_id }));
      yield put(createEffectAction(`_/handleTxMsgs`));
    }
  },
  *handleTxMsgs({ projectDomain, projectType, createAction }, effects) {
    const { select, call, put } = effects;
    const singletonContext = newSingletonContext([projectDomain, projectType, "handleTxMsgs"]);
    if (singletonContext.start()) {
      do {
        try {
          while (true) {
            const { txMsgs, txMsgIDs, projectMsgs } = yield select(
              state => state.project[projectDomain][projectType]._
            );
            if (txMsgIDs.length <= 0) {
              break;
            }
            const tx_id = txMsgIDs[0];
            const txMsg = txMsgs[tx_id];
            if (!txMsg) {
              yield put(createAction(`_/markTxMsgAsHandled`, tx_id));
              continue;
            }

            const { project_id: projectID, session_id: sessionID, msgType, is_failed } = txMsg;
            if (is_failed) {
              yield put(createAction(`_/appendProjectMsgs`, { id: projectID, msgs: [txMsg] }));
              yield put(createAction(`_/markTxMsgAsFailed`, { projectID, tx_id }));
            } else if (msgType === "ripe") {
              yield* handleRipeMsg({ projectMsgs, projectID, sessionID, txMsg, createAction }, effects);
            } else if (msgType === "raw") {
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

function* handleRipeMsg({ projectMsgs, projectID, sessionID, txMsg, createAction }, { call, put }) {
  const projMsgs = projectMsgs[projectID];
  const { domain, type, msg, tx_id } = txMsg;
  try {
    yield put(createAction(`_/updateTxMsg`, { tx_id, status: "sending" }));
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
    yield put(createAction(`_/updateTxMsg`, { tx_id, status: "failed", is_failed: true }));
  }
}
