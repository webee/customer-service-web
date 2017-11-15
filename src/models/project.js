import {} from 'redux';
import * as projectService from '../services/project';

function createSubReducer(name, defaultState, reducers) {
  return (state=defaultState, action) => {
    let type = action.type;
    if (type && type.startsWith(name)) {
      type = type.substr(name.length+1);
    }
    const reducer = reducers[type];
    if (reducer) {
      return reducer(state, action);
    }
    return state;
  };
}

function createSubEffectFunc(name, effectFuncs) {
  function *subEffectFunc(action, effects) {
    let type = action.type;
    if (type && type.startsWith(name)) {
      type = type.substr(name.length+1);
    }
    const effectFunc = effectFuncs[type];
    if (effectFunc) {
      yield effectFunc(action, effects);
    }
  }
  return subEffectFunc;
}

// reducers
// 我接待的会话
const domainTypeMyHandlingReducer = createSubReducer('myHandling', {
  // 所有会话by id
  sessions: {},
  // 接待中的会话
  list_sessions: [],
  // 打开的接待中的会话
  opened_sessions: [],
  // 当前正在处理的打开的接待中的会话
  current_opened_session: null
}, {
  saveSessions(state, {payload: session_list}) {
    const sessions = {};
    const list_sessions = [];
    for (let s of session_list) {
      sessions[s.id] = s;
      list_sessions.push(s.id);
    }

    return { ...state, sessions, list_sessions};
  },
  openSession(state, {payload: id}) {
    if (!state.sessions.hasOwnProperty(id)) {
      return state;
    }
    const current_opened_session = id;
    const opened_sessions = [...state.opened_sessions];
    if (opened_sessions.indexOf(id) === -1) {
      opened_sessions.push(id);
    }
    return {...state, opened_sessions, current_opened_session};
  },
  activateOpenedSession(state, {payload: id}) {
    if (!state.opened_sessions.indexOf(id) === -1) {
      return state;
    }
    return {...state, current_opened_session: id};
  },
  closeOpenedSession(state, {payload: id}) {
    if (!state.opened_sessions.indexOf(id) === -1) {
      return state;
    }
    const opened_sessions = state.opened_sessions.filter(i => i != id);
    let current_opened_session = state.current_opened_session;
    if (current_opened_session === id) {
      current_opened_session = opened_sessions[0];
    }

    return {...state, opened_sessions, current_opened_session};
  },
});


function domainTypeReducer(state={}, action) {
  return {
    myHandling: domainTypeMyHandlingReducer(state.myHandling, action)
  }
}

// effects
const domainTypeMyHandlingEffectFunc = createSubEffectFunc('myHandling', {
  *fetchSessions({ project_domain, project_type, payload }, { call, put }) {
    const sessions = yield call(projectService.fetchMyHandlingSessions, project_domain, project_type);
    yield put(projectService.createDomainTypeAction(project_domain, project_type, 'myHandling/saveSessions', sessions));
  },
  *openSession({ project_domain, project_type, payload}, { call, put }) {
  },
});

function *domainTypeEffectFunc(action, effects) {
  yield domainTypeMyHandlingEffectFunc(action, effects);
}


export default {
  namespace: 'project',

  state: {},
  reducers: {
    dispatchDomainType(state, {payload: {project_domain, project_type, type, payload}}) {
      const key = [project_domain, project_type];
      return {...state, [key]:domainTypeReducer(state[key], {type, payload})};
    }
  },
  effects: {
    *dispatchDomainTypeEffect({ payload:{project_domain, project_type, type, payload} }, effects) {
      yield domainTypeEffectFunc({project_domain, project_type, type, payload}, effects);
		}
  }
};
