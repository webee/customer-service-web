import { notification } from "antd";
import { XChatClient, wampDebug, XCHAT_STATUS } from "xchat-client";
import * as appService from "../services/app";
import * as projectService from "../services/project";
import { createProjectDomainTypeAction } from "../services/project";

// xchat client
const xchatClient = new XChatClient();

export default {
  namespace: "app",

  state: {
    ui_settings: {},
    staff: null,
    app: null,
    // project domain type tree
    projectDomains: null,
    // 所有domains by name
    domains: {},
    // 所有types by name
    types: {},
    xchatInfo: null,
    xchatStatusInfo: null
  },
  reducers: {
    saveUISettings(state, { payload }) {
      return { ...state, ui_settings: { ...state.ui_settings, ...payload } };
    },
    saveAppInfo(state, { payload: { app, staff, project_domain_tree } }) {
      const domains = {};
      const types = {};
      const projectDomains = project_domain_tree.map(pd => pd.name);
      project_domain_tree.forEach(pd => {
        domains[pd.name] = { ...pd, types: pd.types.map(t => t.name) };
        pd.types.forEach(pt => {
          types[pt.name] = pt;
        });
      });
      return { ...state, app, staff, projectDomains: projectDomains, domains, types };
    },
    saveXChatInfo(state, { payload: xchatInfo }) {
      return { ...state, xchatInfo };
    },
    updateXChatStatusInfo(state, { payload: xchatStatusInfo }) {
      return { ...state, xchatStatusInfo };
    }
  },
  effects: {
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
      staffAppInfo.project_domain_tree.forEach(d => {
        d.types.forEach(t => {
          // NOTE: initialize project domain/type states.
          projectDomainTypeActions.push(put(createProjectDomainTypeAction(d.name, t.name)));
        });
      });
      yield all(projectDomainTypeActions);

      yield put({ type: "saveAppInfo", payload: staffAppInfo });
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
  },
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
              projectService.handleNotify(dispatch, type, details);
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
