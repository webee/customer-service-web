import { routerRedux } from 'dva/router';
import request from '~/utils/request';
import * as authService from '../services/auth';


export default {
  namespace: 'auth',
  state: {
    authenticated: false,
  },
  reducers: {
    authenticated(state, {payload}) {
      return {...state, authenticated: payload};
    }
  },
  effects: {
    *refreshJWT({payload: jwt}, { call, put }) {
      try {
        jwt = yield call(authService.refreshJWT, jwt);
        yield call(authService.persistJWT, jwt);
        yield put({type: 'authenticated', payload: true});
      } catch(error) {
        console.error(error);
        yield call(authService.persistJWT, null);
        yield put({type: 'authenticated', payload: false});
      }
    },
    *authenticate(action, {call, put}) {
      const jwt = authService.loadJWT();
      if (jwt) {
        yield put({type: 'refreshJWT', payload: jwt});
      }
    },
    *login({payload: {jwt, login_url}}, {call, put}) {
      try {
        jwt = yield call(authService.refreshJWT, jwt);
        yield call(authService.persistJWT, jwt);
        yield put({type: 'authenticated', payload: true});
        yield call(authService.persistLoginURL, login_url);
      } catch(error) {
        console.error(error);
        yield call(authService.persistJWT, null);
        yield put({type: 'authenticated', payload: false});
      }
    },
    *logout(action, {call, put}) {
      yield call(authService.persistJWT, null);
      yield put({type: 'authenticated', payload: false});
      yield put(routerRedux.push({pathname: '/auth'}));
    },
  },
  subscriptions: {
    init({ dispatch, history }, done) {
      // request
      // attach authorization header
      const attach_auth_header = request.interceptors.request.use((config) => {
        const headers = config.headers || {};
        return {...config, headers: {...headers, 'X-STAFF-JWT': authService.loadJWT()}};
      });

      // response
      // check 401 unauthorized
      // redirect to /auth
      const check_401 = request.interceptors.response.use((response) => {
        return response;
      }, (error) => {
        console.debug('error: ', error);
        if (error.response) {
          const response = error.response;
          console.debug('response: ', response);
          console.debug('response data: ', response.data);
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          done(new Error(response.data.message));
          if (response.status == 401) {
            dispatch(routerRedux.push({pathname: '/auth'}));
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.debug('request failed: ', error.request);
          done(error);
        } else {
          // Something happened in setting up the request that triggered an Error
          done(error);
        }
        throw error;
      });

      // refresh interval, 1/h
      const try_refresh = () => {
				dispatch({type: 'authenticate'});
      };
      const refresh_interval = setInterval(try_refresh, 1 * 60 * 60 * 1000);

      return () => {
        request.interceptors.request.eject(attach_auth_header);
        request.interceptors.response.eject(check_401);
        clearInterval(refresh_interval);
      };
    },
  },
};
