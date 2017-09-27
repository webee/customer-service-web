import * as appService from '../services/app';


export default {
  namespace: 'app',

  state: {
    staff: null,
    app: null,
    project_domains: null,
  },
  reducers: {
    save(state, {payload}) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const staffAppTree = yield call(appService.fetchStaffAppTree);
      yield put({ type: 'save', payload: staffAppTree });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },
};
