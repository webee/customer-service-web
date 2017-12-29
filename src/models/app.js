import { notification } from "antd";
import { toPromiseEffects } from "./utils";
import { XChatClient, wampDebug, XCHAT_STATUS } from "xchat-client";
import { listToDict } from "./utils";
import * as appService from "../services/app";
import * as xfilesService from "../services/xfiles";
import * as projectNotify from "../services/projectNotify";
import { createProjectDomainTypeAction } from "../services/project";

// xchat client
const xchatClient = new XChatClient();

export default {
  namespace: "app",

  state: {
    ui_settings: {},
    staff: {},
    app: null,
    // project domain type tree
    projectDomains: [],
    // 所有domains by name
    domains: {},

    // 以下不影响main entry
    // 所有staff by uid
    staffs: {},
    // 所有customer by uid
    customers: {},
    xchatInfo: {},
    xfilesInfo: {},
    xchatStatusInfo: {}
  },
  reducers: {
    saveUISettings(state, { payload }) {
      return { ...state, ui_settings: { ...state.ui_settings, ...payload } };
    },
    saveAppInfo(state, { payload: { app, staff, project_domains: projectDomains } }) {
      console.log('saveAppInfo');
      const domains = {};
      projectDomains.forEach(pd => {
        const types = {};
        pd.types.forEach(pt => {
          types[pt.name] = pt;
        });
        domains[pd.name] = { ...pd, types };
      });
      return { ...state, app, staff, projectDomains, domains };
    },
    updateStaffs(state, { payload: staffList }) {
      const staffs = listToDict(staffList, u => u.uid);
      let staff = state.staff;
      if (staff.uid in staffs) {
        staff = { ...staff, ...staffs[staff.uid] };
      }
      const newStaffs = { ...state.staffs };
      for (const uid in staffs) {
        newStaffs[uid] = { ...newStaffs[uid], ...staffs[uid] };
      }
      return { ...state, staff, staffs: newStaffs };
    },
    updateCustomers(state, { payload: customerList }) {
      const customers = listToDict(customerList, u => u.uid);
      return { ...state, customers: { ...state.customers, ...customers } };
    },
    saveXChatInfo(state, { payload: xchatInfo }) {
      return { ...state, xchatInfo };
    },
    saveXFilesInfo(state, { payload: xfilesInfo }) {
      return { ...state, xfilesInfo };
    },
    updateXChatStatusInfo(state, { payload: xchatStatusInfo }) {
      return { ...state, xchatStatusInfo };
    }
  },
  effects: toPromiseEffects({
    *setUISettings({ payload }, { call, select, put }) {
      yield put({ type: "saveUISettings", payload });
      const ui_settings = yield select(state => state.app.ui_settings);
      yield call(appService.saveUISettings, ui_settings);
    },
    *loadUISettings(action, { call, put }) {
      const ui_settings = yield call(appService.loadUISettings);
      yield put({ type: "saveUISettings", payload: ui_settings });
    },
    *fetchAppInfo({ payload }, { all, call, put }) {
      const staffAppInfo = yield call(appService.fetchStaffAppInfo);
      // init project state
      const projectDomainTypeActions = [];
      staffAppInfo.project_domains.forEach(domain => {
        domain.types.forEach(type => {
          // NOTE: initialize project domain/type states.
          projectDomainTypeActions.push(put(createProjectDomainTypeAction(domain.name, type.name, "@@INIT")));
        });
      });
      yield all(projectDomainTypeActions);

      const { staffs } = staffAppInfo;
      yield put({ type: "updateStaffs", payload: staffs });
      yield put({ type: "saveAppInfo", payload: staffAppInfo });
    },
    *fetchXFilesInfo(action, { call, put }) {
      const xfilesInfo = yield call(appService.getXFilesInfo);
      yield put({ type: "saveXFilesInfo", payload: xfilesInfo });
      xfilesService.setupToken(xfilesInfo.token);
    },
    *openXChat(action, { call, put }) {
      const xchatInfo = yield call(appService.getXChatInfo);
      yield put({ type: "saveXChatInfo", payload: xchatInfo });

      xchatClient.close();
      xchatClient.setup(xchatInfo.ws_url, xchatInfo.token);
      xchatClient.open();
    },
    *closeXChat(action, { call, put }) {
      xchatClient.close();
    }
  }),
  subscriptions: {
    xchat({ dispatch, history }) {
      xchatClient.onconnected = () => {
        xchatClient.pubUserInfo("");
      };
      xchatClient.onstatuschange = (status, details) => {
        dispatch({ type: "updateXChatStatusInfo", payload: { status, details } });
      };
      xchatClient.onmsg = (kind, msg) => {
        console.debug("xchat msg: ", kind, msg);
      };
      xchatClient.subMsg((kind, msg) => {
        // dispatch notify
        const { domain } = msg;
        if (!domain || domain === "cs") {
          try {
            const { ns, type, details } = JSON.parse(msg.msg);
            if (ns === "project") {
              projectNotify.handle(dispatch, type, details);
            }
          } catch (err) {
            console.error(err);
          }
        }
      }, "user_notify");
    },
    // TODO: xxx
    setup({ dispatch, history }) {},
    block({ history }) {
      //return history.block('确定要离开?');
    }
  }
};
