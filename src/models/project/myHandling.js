import { createNSSubEffectFunc, createNSSubReducer } from "../utils";
import * as projectService from "../../services/project";
import { updateSessionList } from "./_";

const ns = "myHandling";
// reducers
export const reducer = createNSSubReducer(
  ns,
  {
    // TODO: 使用version来控制列表及列表内容的修改 
    version: 0,
    // 接待中的会话
    listSessions: [],
    listFilters: {
      isOnline: false,
      hasUnread: false
    },
    // latest_msg_ts|oldest_msg_ts
    listSortBy: "latest_msg_ts",
    // 打开的接待中的会话id
    openedSessions: [],
    // 当前正在处理的打开的接待中的会话
    currentOpenedSession: null,
    currentOpenedSessionState: {
      isInRead: false
    }
  },
  {
    saveListSessions(state, { payload: listSessions }) {
      return { ...state, listSessions };
    },
    changeListSortBy(state, { payload: listSortBy }) {
      return { ...state, listSortBy };
    },
    updateListFilters(state, { payload }) {
      const listFilters = { ...state.listFilters, ...payload };
      return { ...state, listFilters };
    },
    openSession(state, { payload: id }) {
      if (state.listSessions.indexOf(id) < 0) {
        return state;
      }
      if (state.currentOpenedSession === id) {
        return state;
      }

      const currentOpenedSession = id;
      const openedSessions = [...state.openedSessions];
      if (openedSessions.indexOf(id) === -1) {
        openedSessions.push(id);
      }
      return { ...state, openedSessions, currentOpenedSession, currentOpenedSessionState: { isInRead: false } };
    },
    updateCurrentOpenedSessionState(state, { payload: sessionState }) {
      const currentOpenedSessionState = { ...state.currentOpenedSessionState, ...sessionState };
      return { ...state, currentOpenedSessionState };
    },
    activateOpenedSession(state, { payload: id }) {
      if (!state.openedSessions.indexOf(id) < 0) {
        return state;
      }
      if (state.currentOpenedSession === id) {
        return state;
      }
      return { ...state, currentOpenedSession: id, currentOpenedSessionState: { isInRead: false } };
    },
    closeOpenedSession(state, { payload: id }) {
      if (!state.openedSessions.indexOf(id) === -1) {
        return state;
      }
      const openedSessions = state.openedSessions.filter(i => i != id);
      let currentOpenedSession = state.currentOpenedSession;
      if (currentOpenedSession === id) {
        currentOpenedSession = openedSessions[0];
        return { ...state, openedSessions, currentOpenedSession, currentOpenedSessionState: { isInRead: false } };
      }
      return { ...state, openedSessions };
    }
  }
);

// effects
export const effectFunc = createNSSubEffectFunc(ns, {
  *fetchSessions({ projectDomain, projectType, createAction, createEffectAction, payload }, { call, put }) {
    const sessionList = yield call(projectService.fetchMyHandlingSessions, projectDomain, projectType);
    yield* updateSessionList({ createAction, payload: sessionList }, { call, put });
    yield put(createAction(`${ns}/saveListSessions`, sessionList.map(s => s.id)));
  },
  *sendSessionMsg({ payload: { projectID, sessionID, domain, type, content } }, { call, put }) {
    yield call(projectService.sendSessionMsg, projectID, sessionID, { domain, type, content });
  }
});
