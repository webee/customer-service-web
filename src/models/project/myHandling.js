import { collectTypeReducers, createNSSubEffectFunc } from "../utils";
import * as projectService from "../../services/project";
import * as msgCodecService from "../../services/msgCodec";

const DEFAULT_SESSION_STATE = { isInRead: false };
const ns = "myHandling";
// reducers
export const reducer = collectTypeReducers(
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
    // by session id: {isInRead}
    openedSessionsState: {}
  },
  {
    addToListSessions(state, { payload: id }) {
      if (state.listSessions.indexOf(id) >= 0) {
        return state;
      }
      const listSessions = [...state.listSessions, id];
      return { ...state, listSessions };
    },
    removeFromListSessions(state, { payload: id }) {
      if (state.listSessions.indexOf(id) < 0) {
        return state;
      }
      const listSessions = state.listSessions.filter(i => i != id);
      return { ...state, listSessions };
    },
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
      if (openedSessions.indexOf(id) < 0) {
        openedSessions.push(id);
      }
      const curSessionState = state.openedSessionsState[id] || DEFAULT_SESSION_STATE;
      const openedSessionsState = { ...state.openedSessionsState, [id]: curSessionState };
      return { ...state, openedSessions, currentOpenedSession, openedSessionsState };
    },
    updateOpenedSessionState(state, { payload: { id, sessionState } }) {
      const curSessionState = state.openedSessionsState[id] || DEFAULT_SESSION_STATE;
      const openedSessionsState = { ...state.openedSessionsState, [id]: { ...curSessionState, ...sessionState } };
      return { ...state, openedSessionsState };
    },
    activateOpenedSession(state, { payload: id }) {
      if (state.openedSessions.indexOf(id) < 0) {
        return state;
      }
      if (state.currentOpenedSession === id) {
        return state;
      }
      return { ...state, currentOpenedSession: id };
    },
    closeOpenedSession(state, { payload: id }) {
      if (state.openedSessions.indexOf(id) < 0) {
        return state;
      }
      const openedSessions = state.openedSessions.filter(i => i != id);
      const openedSessionsState = { ...state.openedSessionsState };
      delete openedSessionsState[id];
      let currentOpenedSession = state.currentOpenedSession;
      if (currentOpenedSession === id) {
        currentOpenedSession = openedSessions[0];
        return { ...state, openedSessions, currentOpenedSession, openedSessionsState };
      }
      return { ...state, openedSessions };
    }
  }
);

// effects
export const effectFunc = createNSSubEffectFunc(ns, {
  *fetchSessions({ projectDomain, projectType, createAction, createEffectAction, payload }, { call, put }) {
    const sessionList = yield call(projectService.fetchMyHandlingSessions, projectDomain, projectType);
    sessionList.forEach(s => {
      if (s.msg) {
        s.msg = { ...s.msg, ...msgCodecService.decodeMsg(s.msg) };
      }
    });
    yield updateSessionList({ createAction, payload: sessionList }, { call, put });
    yield put(createAction(`${ns}/saveListSessions`, sessionList.map(s => s.id)));
  },
  *fetchSessionItem({ projectDomain, projectType, createAction, payload: sessionID }, { call, put }) {
    const s = yield call(projectService.fetchSessionItem, projectDomain, projectType, sessionID);
    if (s.msg) {
      s.msg = { ...s.msg, ...msgCodecService.decodeMsg(s.msg) };
    }

    yield updateSessionList({ createAction, payload: [s] }, { call, put });
    yield put(createAction(`${ns}/addToListSessions`, s.id));
  },
  *finishHandlingSession({ createEffectAction, payload: { projectID, sessionID } }, { call, put }) {
    yield call(projectService.finishHandlingSession, projectID, sessionID);
    yield put(createEffectAction(`${ns}/removeHandlingSession`, { sessionID }));
  },
  *removeHandlingSession({ createAction, payload: { sessionID } }, { call, put }) {
    yield put(createAction(`${ns}/closeOpenedSession`, sessionID));
    yield put(createAction(`${ns}/removeFromListSessions`, sessionID));
    yield put(createAction(`_/removeSession`, sessionID));
  }
});

function* updateSessionList({ createAction, payload: sessionList }, { call, put }) {
  yield put(
    createAction(`_/updateSessions`, sessionList.map(s => ({ ...s, project_id: s.project.id, project: undefined })))
  );
  // TODO: 修改staffs和customers, 使用id引用
  const projectList = sessionList.map(s => s.project);
  yield put(createAction(`_/updateProjects`, projectList));

  const staffs = [];
  const customers = [];
  projectList.forEach(p => {
    // staffs
    staffs.push(p.leader);
    // customers
    customers.push(p.owner);
    customers.push(...p.customers);
  });
  yield put({ type: "app/updateStaffs", payload: staffs });
  yield put({ type: "app/updateCustomers", payload: customers });
}
