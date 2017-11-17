import { routerRedux } from "dva/router";
import request from "~/utils/request";
import envConfig from "~/config";
import { STAFF_JWT_HEADER } from "~/constants";
import * as authService from "../services/auth";
import { authPath } from "../config";

export default {
  namespace: "auth",
  state: {},
  reducers: {},
  effects: {
    *refreshJWT({ payload: jwt }, { call }) {
      jwt = yield call(authService.refreshJWT, jwt);
      yield call(authService.saveJWT, jwt);
    },
    *login({ payload: { jwt, login_url } }, { call }) {
      try {
        jwt = yield call(authService.refreshJWT, jwt);
        yield call(authService.saveJWT, jwt);
        yield call(authService.saveLoginURL, login_url);
      } catch (error) {
        console.error(error);
        yield call(authService.clearJWT);
        throw error;
      }
    },
    *resetState(action, { call, put }) {
      yield call(authService.clearJWT);
      yield put({ type: "RESET", payload: "*" });
    },
    *logout({ payload: state }, { call, put }) {
      yield put({ type: "resetState" });
      yield put(routerRedux.push({ pathname: authPath, state }));
    }
  },
  subscriptions: {
    init({ dispatch, history }, done) {
      const do_logout = () => {
          dispatch({ type: "logout", payload: { from: history.location } });
      };

      // request
      // attach authorization header
      const attach_auth_header = request.interceptors.request.use(config => {
        const headers = config.headers || {};
        if (headers.hasOwnProperty(STAFF_JWT_HEADER)) {
          return config;
        }
        const jwt = authService.loadJWT();
        const jwt_exp = authService.loadJWTExp();
        if (!(jwt && jwt_exp)) {
          do_logout();
        } else if (!(jwt_exp - new Date() > envConfig.jwtRefreshTime)) {
          dispatch({ type: "refreshJWT", payload: jwt }).catch((err) => {
            console.error(err);
            do_logout();
          });
        }
        return { ...config, headers: { ...headers, [STAFF_JWT_HEADER]: jwt } };
      });

      // response
      // check 401 unauthorized
      // redirect to /auth
      const check_401 = request.interceptors.response.use(
        response => {
          return response;
        },
        error => {
          console.debug("error: ", error);
          if (error.response) {
            const response = error.response;
            console.debug("response: ", response);
            console.debug("response data: ", response.data);
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            done(new Error(response.data.message));
            if (response.status == 401) {
              do_logout();
            }
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.debug("request failed: ", error.request);
            done(error);
          } else {
            // Something happened in setting up the request that triggered an Error
            done(error);
          }
          throw error;
        }
      );

      return () => {
        request.interceptors.request.eject(attach_auth_header);
        request.interceptors.response.eject(check_401);
      };
    }
  }
};