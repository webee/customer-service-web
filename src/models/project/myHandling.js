import { createNSSubEffectFunc, createNSSubReducer } from "../utils";
import * as projectService from "../../services/project";

// reducers
export const reducer = createNSSubReducer(
  "myHandling",
  {
    // 所有会话by id
    sessions: {},
    // 接待中的会话
    listSessions: [],
    // 打开的接待中的会话id
    openedSessions: [],
    // 当前正在处理的打开的接待中的会话
    currentOpenedSession: null,
    // 会话的消息信息by id: {lid, rid, [msgs]}
    sessionsMsgs: {}
  },
  {
    saveSessions(state, { payload: session_list }) {
      const sessions = {};
      const listSessions = [];
      for (let s of session_list) {
        sessions[s.id] = s;
        listSessions.push(s.id);
      }

      return { ...state, sessions, listSessions };
    },
    openSession(state, { payload: id }) {
      if (!state.sessions.hasOwnProperty(id)) {
        return state;
      }
      const currentOpenedSession = id;
      const openedSessions = [...state.openedSessions];
      if (openedSessions.indexOf(id) === -1) {
        openedSessions.push(id);
      }
      return { ...state, openedSessions, currentOpenedSession };
    },
    activateOpenedSession(state, { payload: id }) {
      if (!state.openedSessions.indexOf(id) === -1) {
        return state;
      }
      return { ...state, currentOpenedSession: id };
    },
    closeOpenedSession(state, { payload: id }) {
      if (!state.openedSessions.indexOf(id) === -1) {
        return state;
      }
      const openedSessions = state.openedSessions.filter(i => i != id);
      let currentOpenedSession = state.currentOpenedSession;
      if (currentOpenedSession === id) {
        currentOpenedSession = openedSessions[0];
      }

      return { ...state, openedSessions, currentOpenedSession };
    },
    clearSessionMsgs(state, { payload: id }) {
      const newSessionsMsgs = {...state.sessionsMsgs};
      delete newSessionsMsgs[id];
      return { ...state, sessionsMsgs: newSessionsMsgs };
    },
    appendSessionMsgs(state, { payload: { id, msgs } }) {
      const newSessionsMsgs = { ...state.sessionsMsgs };
      let { lid, rid, msgs: _msgs } = newSessionsMsgs[id] || { msgs: [] };
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
      newSessionsMsgs[id] = { lid, rid, msgs: newMsgs };
      return { ...state, sessionsMsgs: newSessionsMsgs };
    },
    insertSessionMsgs(state, { payload: { id, msgs, noMore } }) {
      const newSessionsMsgs = { ...state.sessionsMsgs };
      let { lid, rid, msgs: _msgs } = newSessionsMsgs[id] || { msgs: [] };
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
      newSessionsMsgs[id] = { lid, rid, msg: newMsgs, noMore };
      return { ...state, sessionsMsgs: newSessionsMsgs };
    }
  }
);

// effects
export const effectFunc = createNSSubEffectFunc("myHandling", {
  *fetchSessions({ projectDomain, projectType, createAction, payload }, { call, put }) {
    const sessions = yield call(projectService.fetchMyHandlingSessions, projectDomain, projectType);
    yield put(createAction("myHandling/saveSessions", sessions));
  },
  *loadSessionHistoryMsgs({ key, createAction, payload: { projectID, sessionID, limit } }, { select, call, put }) {
    const data = yield select(state => state.project[key].myHandling.sessionsMsgs);
    const { lid } = data[sessionID] || {};
    const { msgs } = yield call(projectService.fetchSessionMsgs, projectID, sessionID, {
      rid: lid,
      limit,
      desc: true
    });
    const noMore = limit > 0 && msgs.length == 0;
    yield put(createAction("myHandling/insertSessionMsgs", { id: sessionID, msgs, noMore }));
  },
  *fetchSessionNewMsgs({ key, createAction, payload: { projectID, sessionID, limit } }, { select, call, put }) {
    const data = yield select(state => state.project[key].myHandling.sessionsMsgs);
    const { rid } = data[sessionID] || {};
    const { msgs, has_more } = yield call(projectService.fetchSessionMsgs, projectID, sessionID, {
      lid: rid,
      limit,
      desc: false
    });
    yield put(createAction("myHandling/appendSessionMsgs", { id: sessionID, msgs: msgs }));
  }
});
