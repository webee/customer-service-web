import { collectTypeReducers, createNSSubEffectFunc } from "../utils";
import * as service from "~/services/project";
import * as msgCodecService from "~/services/msgCodec";
import { extractFilter } from "~/utils/filters";

const ns = "handling";
// reducers
export const reducer = collectTypeReducers(
  {
    isFetching: false,
    items: [],
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
      yield put(createAction("handling/updateTableInfos", { isFetching: true }));

      const { pagination, filters, sorter } = yield select(state => state.project[projectDomain][projectType].handling);
      const res = yield call(service.fetchHandlingSessions, projectDomain, projectType, {
        ...params,
        page: pagination.current,
        per_page: pagination.pageSize,
        sorter: sorter.key,
        order: sorter.order,
        is_online: extractFilter(filters, "is_online", false)
      });
      const { page: current, per_page: pageSize, total, items } = res;
      items.forEach(item => {
        if (item.msg) {
          item.msg = { ...item.msg, ...msgCodecService.decodeMsg(item.msg) };
        }
      });
      yield put(createAction("handling/saveFetchResult", { items, pagination: { current, pageSize, total } }));
    } finally {
      yield put(createAction("handling/updateTableInfos", { isFetching: false }));
    }
  }
});
