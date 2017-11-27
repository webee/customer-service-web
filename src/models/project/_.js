import { createNSSubEffectFunc, createNSSubReducer } from "../utils";
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
    // 所有staff by uid
    staffs: {},
    // 所有customers by uid
    customers: {},
    // 项目消息by project id: {lid, rid, [msgs], noMore}
    projectMsgs: {}
  },
  {
    saveSessions(state, { payload: sessionList }) {
      const sessions = { ...state.sessions };
      sessionList.forEach(s => sessions[s.id] = s);

      return { ...state, sessions };
    },
    saveProjects(state, { payload: projectList }) {
      const projects = { ...state.projects };
      const staffs = { ...state.staffs };
      const customers = { ...state.customers };
      projectList.forEach(p => {
        projects[p.id] = p;

        // staffs
        staffs[p.staffs.leader.uid] = p.staffs.leader
        p.staffs.assistants.forEach(u => staffs[u.uid] = u);
        p.staffs.participants.forEach(u => staffs[u.uid] = u);
        // customers
        customers[p.owner.uid] = p.owner;
        p.customers.parties.forEach(u => customers[u.uid] = u);
      });

      return { ...state, projects, staffs, customers };
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
  *syncSessionMsgID({ key, payload: { projectID, sessionID } }, { select, call, put }) {
    const projMsgs = yield select(state => state.project[key]._.projectMsgs[projectID]);
    if (projMsgs && projMsgs.rid) {
      const { rid } = projMsgs;
      yield call(projectService.syncSessionMsgID, projectID, sessionID, rid);
    }
  }
});
