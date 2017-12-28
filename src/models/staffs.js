import { notification } from "antd";
import { toPromiseEffects } from "./utils";
import { listToDict } from "./utils";
import * as service from "../services/staffs";
import { createProjectDomainTypeAction } from "../services/project";
import { removeUndefined } from "../utils/object";
import { extractFilter } from "../utils/filters";

export default {
  namespace: "staffs",

  state: {
    staffs: [],
    pagination: {
      defaultPageSize: 10,
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30", "40", "50", "1", "2", "3"]
    },
    filters: {},
    sorter: {}
  },
  reducers: {
    saveFetchStaffsResult(state, { payload: { staffs, pagination } }) {
      return { ...state, staffs, pagination: { ...state.pagination, ...pagination } };
    },
    updateTableInfos(state, { payload: { pagination, filters, sorter } }) {
      const newState = { ...state };
      if (pagination) {
        newState.pagination = pagination;
      }
      if (filters) {
        newState.filters = filters;
      }
      if (sorter) {
        newState.sorter = { field: sorter.field, order: sorter.order };
      }
      return newState;
    }
  },
  effects: toPromiseEffects({
    *fetchStaffs({ payload: params = {} }, { select, call, put }) {
      const { pagination, filters, sorter } = yield select(state => state.staffs);
      const res = yield call(service.fetchStaffs, {
        ...params,
        page: pagination.current,
        per_page: pagination.pageSize,
        sorter: sorter.field,
        order: sorter.order,
        is_deleted: extractFilter(filters, "is_deleted", false),
        is_online: extractFilter(filters, "is_online", false)
      });
      const { page: current, per_page: pageSize, total, items: staffs } = res;
      yield put({ type: "saveFetchStaffsResult", payload: { staffs, pagination: { current, pageSize, total } } });
      yield put({ type: "app/updateStaffs", payload: staffs });
    }
  }),
  subscriptions: {}
};
