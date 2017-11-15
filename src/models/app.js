import * as appService from '../services/app';
import {createProjectDomainTypeAction} from '../services/project';


export default {
  namespace: 'app',

  state: {
    staff: null,
    app: null,
    project_domains: null,
    ui_settings: appService.loadUISettings(),
  },
  reducers: {
    saveUISettings(state, {payload}) {
      return {...state, ui_settings: {...state.ui_settings,...payload}};
    },
    save(state, {payload}) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *setUISettings({payload}, {call, select, put}) {
      yield put({type: 'saveUISettings', payload});
      const ui_settings = yield select(state => state.app.ui_settings);
      yield call(appService.saveUISettings, ui_settings);
    },
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const staffAppTree = yield call(appService.fetchStaffAppTree);
      // init project state
      for (let d of staffAppTree.project_domains) {
        for (let t of d.types) {
          yield put(createProjectDomainTypeAction(d.name, t.name));
        }
      }
      yield put({ type: 'save', payload: staffAppTree });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
    block({history}) {
      //return history.block('确定要离开?');
    }
  },
};
