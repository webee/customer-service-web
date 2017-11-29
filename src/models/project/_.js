import { createNSSubEffectFunc, createNSSubReducer, listToDict } from "../utils";
import * as projectService from "../../services/project";

const ns = "_";
// reducers
export const reducer = createNSSubReducer(
  ns,
  {
    // 所有会话by id
    sessions: {},
    // 所有项目by id
    projects: {},
    // 项目消息by project id: {lid, rid, [msgs], noMore}
    projectMsgs: {}
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
      let { lid, rid, msgs: _msgs } = projectMsgs[id] || { msgs: [] };
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
      projectMsgs[id] = { lid, rid, msg: newMsgs, noMore };
      return { ...state, projectMsgs };
    }
  }
);

// effects
export const effectFunc = createNSSubEffectFunc(ns, {
  *loadProjectHistoryMsgs({ key, createAction, payload: { projectID, limit } }, { select, call, put }) {
    const projectMsgs = yield select(state => state.project[key]._.projectMsgs);
    const { lid } = projectMsgs[projectID] || {};
    const { msgs } = yield call(projectService.fetchProjectMsgs, projectID, {
      rid: lid,
      limit,
      desc: true
    });
    const noMore = limit > 0 && msgs.length == 0;
    yield put(createAction(`${ns}/insertProjectMsgs`, { id: projectID, msgs, noMore }));
  },
  *fetchProjectNewMsgs({ key, createAction, payload: { projectID, limit } }, { select, call, put }) {
    const projectMsgs = yield select(state => state.project[key]._.projectMsgs);
    const { rid } = projectMsgs[projectID] || {};
    const { msgs, has_more } = yield call(projectService.fetchProjectMsgs, projectID, {
      lid: rid,
      limit,
      desc: false
    });
    yield put(createAction(`${ns}/appendProjectMsgs`, { id: projectID, msgs: msgs }));
  },
  *syncSessionMsgID({ key, createAction, payload: { projectID, sessionID, sync_msg_id } }, { select, call, put }) {
    yield call(projectService.syncSessionMsgID, projectID, sessionID, sync_msg_id);
  },
  *fetchSessionItem({ projectDomain, projectType, createAction, payload: sessionID }, { call, put }) {
    const s = yield call(projectService.fetchSessionItem, projectDomain, projectType, sessionID);

    yield* updateSessionList({ createAction, payload: [s] }, { call, put });
  }
});

export function* updateSessionList({ createAction, payload: sessionList }, { call, put }) {
  yield put(
    createAction("_/updateSessions", sessionList.map(s => ({ ...s, project_id: s.project.id, project: undefined })))
  );
  // TODO: 修改staffs和customers, 使用id引用
  const projectList = sessionList.map(s => s.project);
  yield put(createAction("_/updateProjects", projectList));

  const staffs = [];
  const customers = [];
  projectList.forEach(p => {
    // staffs
    staffs.push(p.staffs.leader);
    staffs.push(...p.staffs.assistants);
    staffs.push(...p.staffs.participants);
    // customers
    customers.push(p.owner);
    customers.push(p.customers.parties);
  });
  yield put({ type: "app/updateStaffs", payload: staffs });
  yield put({ type: "app/updateCustomers", payload: customers });
}
