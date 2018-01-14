import * as appService from "../services/app";
import { toPromiseEffects } from "./utils";

export default {
  namespace: "ui",

  state: {
    settings: {},
    screen: {}
  },
  reducers: {
    saveSettings(state, { payload }) {
      return { ...state, settings: { ...state.settings, ...payload } };
    },
    updateScreen(state, { payload }) {
      return { ...state, screen: { ...state.screen, ...payload } };
    }
  },
  effects: toPromiseEffects({
    *setSettings({ payload }, { call, select, put }) {
      yield put({ type: "saveSettings", payload });
      const settings = yield select(state => state.ui.settings);
      yield call(appService.saveUISettings, settings);
    },
    *loadSettings(action, { call, put }) {
      const settings = yield call(appService.loadUISettings);
      yield put({ type: "saveSettings", payload: settings });
    }
  })
};
