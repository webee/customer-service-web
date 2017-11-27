import { createNSSubEffectFunc, createNSSubReducer } from "../utils";
import * as projectService from "../../services/project";

const ns = "myHandling";
// reducers
export const reducer = createNSSubReducer(
  ns,
  {
    // 接待中的会话
    listSessions: [],
    // 打开的接待中的会话id
    openedSessions: [],
    // 当前正在处理的打开的接待中的会话
    currentOpenedSession: null
  },
  {
    saveListSessions(state, { payload: listSessions }) {
      return { ...state, listSessions };
    },
    openSession(state, { payload: id }) {
      if (state.listSessions.indexOf(id) < 0) {
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
    const sessionList = yield call(projectService.fetchMyHandlingSessions, projectDomain, projectType);
    yield put(
      createAction('_/updateSessions', sessionList.map(s => ({ ...s, project_id: s.project.id, project: undefined })))
    );
    const projectList = sessionList.map(s => s.project);

    const projects = {};
    const staffs = {};
    const customers = {};
    projectList.forEach(p => {
      // TODO: 修改staffs和customers, 使用id引用
      projects[p.id] = p;
      // staffs
      staffs[p.staffs.leader.uid] = p.staffs.leader
      p.staffs.assistants.forEach(u => staffs[u.uid] = u);
      p.staffs.participants.forEach(u => staffs[u.uid] = u);
      // customers
      customers[p.owner.uid] = p.owner;
      p.customers.parties.forEach(u => customers[u.uid] = u);
    });
    yield put(createAction('_/updateProjects', projects));
    yield put({type: 'app/updateStaffs', payload: staffs});
    yield put({type: 'app/updateCustomers', payload: customers});

    yield put(createAction(`${ns}/saveListSessions`, sessionList.map(s => s.id)));
  },
  *sendSessionMsg({ payload: { projectID, sessionID, domain, type, content } }, { call, put }) {
    yield call(projectService.sendSessionMsg, projectID, sessionID, { domain, type, content });
  }
});
