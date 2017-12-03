import { collectTypeReducers, createNSSubEffectFunc, listToDict } from "../utils";
import * as projectService from "../../services/project";

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
    // 项目发送消息列表by project id: [tx_id...]
    projectTxMsgs: {}
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
    addTxMsg(
      state,
      { payload: { projectID, sessionID: session_id, user_type, user_id, domain, type, content, msgType } }
    ) {
      let tx_id = state.tx_id + 1;
      const status = msgType === "ripe" ? "ready" : "pending";
      const ts = Math.round(new Date().getTime() / 1000);
      const txMsg = { session_id, status, user_type, user_id, domain, type, content, ts };

      const txMsgs = { ...state.txMsgs, [tx_id]: txMsg };
      const projTxMsgs = [...(state.projectTxMsgs[projectID] || []), tx_id];
      const projectTxMsgs = { ...state.projectTxMsgs, [projectID]: projTxMsgs };

      return { ...state, tx_id, txMsgs, projectTxMsgs };
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
    yield put(createAction(`_/insertProjectMsgs`, { id: projectID, msgs, noMore }));
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
    if (!rid) {
      yield put(createAction(`_/insertProjectMsgs`, { id: projectID, msgs }));
    } else {
      yield put(createAction(`_/appendProjectMsgs`, { id: projectID, msgs }));
    }
  },
  *syncSessionMsgID({ createAction, payload: { projectID, sessionID, sync_msg_id } }, { select, call, put }) {
    yield call(projectService.syncSessionMsgID, projectID, sessionID, sync_msg_id);
  },
  *sendMsg(
    { createAction, payload: { projectID, sessionID, domain, type, content, msgType = "ripe" } },
    { select, call, put }
  ) {
    const staff = yield select(state => state.app.staff);
    const user_type = "staff";
    const user_id = staff.uid;
    yield put(createAction(`_/addTxMsg`, { projectID, sessionID, user_type, user_id, domain, type, content, msgType }));
  }
});
