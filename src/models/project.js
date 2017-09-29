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

// reducers
// 我接待的会话
const domainTypeMyHandlingReducer = createSubReducer('myHandling', {
  // 接待中的会话
  sessions: [],
  // 打开的接待中的会话
  opened_sessions: [],
  // 当前正在处理的打开的接待中的会话
  current_opened_session: null
}, {
  saveSessions(state, {payload: sessions}) {
    return { ...state, sessions};
  },
});


function domainTypeReducer(state={}, action) {
  return {
    myHandling: domainTypeMyHandlingReducer(state.myHandling, action)
  }
}


export default {
  namespace: 'project',

  state: {},
  reducers: {
    dispatchDomainType(state, {payload: {project_domain, project_type, type, payload}}) {
      const key = [project_domain, project_type];
      return {...state, [key]:domainTypeReducer(state[key], {type, payload})};
    },
  },
  effects: {
    *myHandlingFetchSessions({ payload:{project_domain, project_type} }, { call, put }) {
      const sessions = yield call(projectService.fetchMyHandlingSessions, project_domain, project_type);
      yield put(projectService.createDomainTypeAction(project_domain, project_type, 'myHandling/saveSessions', sessions));
    },
    *myHandlingOpenSessions({ payload:{project_domain, project_type}}, { call, put}) {
    }
  }
};
