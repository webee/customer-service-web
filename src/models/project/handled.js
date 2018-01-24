import { collectTypeReducers, createNSSubEffectFunc, listToDict } from "../utils";
import * as projectService from "../../services/project";
import * as service from "~/services/project";
import * as msgCodecService from "~/services/msgCodec";
import { extractFilter } from "~/utils/filters";
import { updateSessionList, decodeSessionMsgs } from "./commons";

function genSessionStartMsg(id) {
  return { domain: "system", type: "divider", msg: `会话#${id}开始` };
}

const ns = "handled";
// reducers
export const reducer = collectTypeReducers(
  {
    isFetching: false,
    items: [],
    // 所有会话by id
    sessions: {},
    // 所有项目by id
    projects: {},
    // 会话消息by session id: {lid, rid, [msgs], noMore, isFetchingNew, isFetchingHistory, fetchFailed}
    sessionMsgs: {},
    pagination: {
      defaultPageSize: 10,
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30", "40", "50"]
    },
    filters: {},
    sorter: {}
  },
  {
    saveFetchResult(state, { payload: { items, pagination } }) {
      return { ...state, items, pagination: { ...state.pagination, ...pagination } };
    },
    resetCurrentPage(state) {
      return { ...state, pagination: { ...state.pagination, current: 1 } };
    },
    updateTableInfos(state, { payload: { isFetching, pagination, filters, sorter } }) {
      const newState = { ...state };
      if (isFetching !== undefined) {
        newState.isFetching = isFetching;
      }
      if (pagination !== undefined) {
        newState.pagination = pagination;
      }
      if (filters !== undefined) {
        newState.filters = filters;
      }
      if (sorter != undefined) {
        newState.sorter = { field: sorter.field, key: sorter.columnKey, order: sorter.order };
      }
      return newState;
    },
    updateSessionMsgsIsFetching(state, { payload: { id, isFetchingNew, isFetchingHistory, fetchFailed } }) {
      const sessionMsgs = { ...state.sessionMsgs };
      const sessionMsg = { ...(sessionMsgs[id] || {}) };
      if (isFetchingNew !== undefined) {
        sessionMsg.isFetchingNew = isFetchingNew;
      }
      if (isFetchingHistory !== undefined) {
        sessionMsg.isFetchingHistory = isFetchingHistory;
      }
      if (fetchFailed !== undefined) {
        sessionMsg.fetchFailed = fetchFailed;
      }
      sessionMsgs[id] = sessionMsg;
      return { ...state, sessionMsgs };
    },
    clearSessionMsgsData(state) {
      return { ...state, sessions: {}, projects: {}, sessionMsgs: {} };
    },
    updateSessions(state, { payload: sessionList }) {
      const sessions = listToDict(sessionList, o => o.id);
      return { ...state, sessions: { ...state.sessions, ...sessions } };
    },
    updateProjects(state, { payload: { projectList, isUpdate } }) {
      if (isUpdate) {
      // 必须要求已经存在
        projectList = projectList.filter(o => o.id in state.projects);
      }
      const projects = listToDict(projectList, o => o.id);
      return { ...state, projects: { ...state.projects, ...projects } };
    },
    insertSessionMsgs(state, { payload: { session, msgs, noMore } }) {
      const { id, start_msg_id } = session;
      const sessionMsgs = { ...state.sessionMsgs };
      const sessionMsg = { ...(sessionMsgs[id] || {}) };
      let { lid, rid, msgs: _msgs = [], noMore: _noMore } = sessionMsg;
      const newNoMore = noMore === undefined ? _noMore : noMore;
      let newMsgs = [..._msgs];
      msgs.forEach(msg => {
        if (!lid || msg.msg_id < lid) {
          lid = msg.msg_id;
          if (lid === start_msg_id) {
            newMsgs.unshift(genSessionStartMsg(id));
          }

          newMsgs.unshift({ ...msg, is_rx: true });
        }

        if (!rid) {
          rid = msg.msg_id;
        }
      });
      sessionMsgs[id] = { lid, rid, msgs: newMsgs, noMore: newNoMore };
      return { ...state, sessionMsgs };
    }
  }
);

// effects
export const effectFunc = createNSSubEffectFunc(ns, {
  *fetchSessions(
    { projectDomain, projectType, createAction, createEffectAction, payload: params = {} },
    { select, call, put }
  ) {
    try {
      yield put(createAction("handled/updateTableInfos", { isFetching: true }));

      const { pagination, filters, sorter } = yield select(state => state.project[projectDomain][projectType].handled);
      const res = yield call(service.fetchHandledSessions, projectDomain, projectType, {
        ...params,
        page: pagination.current,
        per_page: pagination.pageSize,
        sorter: sorter.key,
        order: sorter.order,
        is_online: extractFilter(filters, "is_online", false)
      });
      const { page: current, per_page: pageSize, total, items } = res;
      items.forEach(decodeSessionMsgs);
      yield put(createAction("handled/saveFetchResult", { items, pagination: { current, pageSize, total } }));
    } finally {
      yield put(createAction("handled/updateTableInfos", { isFetching: false }));
    }
  },
  *updateSessionList({ createAction, payload: sessionList }, { call, put }) {
    yield updateSessionList({ ns, createAction, payload: sessionList }, { call, put });
  },
  *loadSessionHistoryMsgs(
    { projectDomain, projectType, createAction, payload: { session, limit = 256 } },
    { select, call, put }
  ) {
    const { project } = session;
    const sessionMsgs = yield select(state => state.project[projectDomain][projectType].handled.sessionMsgs);
    const projectMsg = sessionMsgs[session.id] || {};
    const { lid, rid, fetchFailed } = projectMsg;
    try {
      if (projectMsg.noMore) {
        return;
      }
      if (fetchFailed) {
        yield put(
          createAction(`${ns}/updateSessionMsgsIsFetching`, {
            id: session.id,
            fetchFailed: false,
            isFetchingHistory: true,
            isFetchingNew: !lid && !rid
          })
        );
      } else {
        yield put(
          createAction(`${ns}/updateSessionMsgsIsFetching`, {
            id: session.id,
            isFetchingHistory: true,
            isFetchingNew: !lid && !rid
          })
        );
      }

      const { msgs, no_more } = yield call(projectService.fetchProjectMsgs, project.id, {
        rid: lid || session.msg_id + 1,
        limit,
        desc: true
      });
      const noMore = no_more || (limit > 0 && msgs.length == 0);
      const decodedMsgs = msgs.map(msg => ({ ...msg, ...msgCodecService.decodeMsg(msg) }));
      yield put(createAction(`${ns}/insertSessionMsgs`, { session, msgs: decodedMsgs, noMore }));
    } catch (e) {
      console.error(e);
      if (!lid && !rid) {
        yield put(createAction(`${ns}/updateSessionMsgsIsFetching`, { id: session.id, fetchFailed: true }));
      }
    } finally {
      yield put(
        createAction(`${ns}/updateSessionMsgsIsFetching`, {
          id: session.id,
          isFetchingHistory: false,
          isFetchingNew: false
        })
      );
    }
  }
});
