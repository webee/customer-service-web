import { createNSSubEffectFunc, createNSSubReducer } from "../utils";
import * as projectService from "../../services/project";

const ns = '_';
// reducers
export const reducer = createNSSubReducer(
  ns,
  {
    // 项目消息by project id: {lid, rid, [msgs], noMore}
    projectMsgs: {}
  },
  {
    clearProjectMsgs(state, { payload: id }) {
      const projectMsgs = {...state.projectMsgs};
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
    },
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
  }
});
