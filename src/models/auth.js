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
      yield put(routerRedux.push({ pathname: authPath, state }));
      yield put({ type: "resetState" });
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
      const checkResponse = request.interceptors.response.use(
        response => {
          return response;
        },
        err => {
          console.error(err);
          if (err.response) {
            const response = err.response;
            console.debug("response: ", response);
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (response.status === 401) {
              do_logout();
            } else if (response.status === 409) {
              // 业务错误
              const { data } = response;
              done(new Error(`${data.code}(${data.message}: ${data.description}, ${data.details})`));
            } else {
              done(new Error(response.data.message));
            }
          } else if (err.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.debug("request failed: ", err.request);
            done(err);
          } else {
            // Something happened in setting up the request that triggered an Error
            done(err);
          }
          throw err;
        }
      );

      return () => {
        request.interceptors.request.eject(attach_auth_header);
        request.interceptors.response.eject(checkResponse);
      };
    }
  }
};
