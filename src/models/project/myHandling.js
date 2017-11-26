import { createNSSubEffectFunc, createNSSubReducer } from "../utils";
import * as projectService from "../../services/project";

const ns = "myHandling";
// reducers
export const reducer = createNSSubReducer(
  ns,
  {
    // 所有会话by id
    sessions: {},
    // 接待中的会话
    listSessions: [],
    // 打开的接待中的会话id
    openedSessions: [],
    // 当前正在处理的打开的接待中的会话
    currentOpenedSession: null
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
    }
  }
);

// effects
export const effectFunc = createNSSubEffectFunc(ns, {
  *fetchSessions({ projectDomain, projectType, createAction, payload }, { call, put }) {
    const sessions = yield call(projectService.fetchMyHandlingSessions, projectDomain, projectType);
    yield put(createAction(`${ns}/saveSessions`, sessions));
  },
  *sendSessionMsg({ payload: { projectID, sessionID, domain, type, content } }, { call, put }) {
    yield call(projectService.sendSessionMsg, projectID, sessionID, {domain, type, content});
  },
});
