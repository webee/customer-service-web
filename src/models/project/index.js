import { reducer as myHandlingReducer, effectFunc as myHandlingEffectFunc } from './myHandling';

function domainTypeReducer(state = {}, action) {
  return {
    myHandling: myHandlingReducer(state.myHandling, action)
  };
}

function* domainTypeEffectFunc(action, effects) {
  yield myHandlingEffectFunc(action, effects);
}

export default {
  namespace: "project",

  state: {},
  reducers: {
    dispatchDomainType(state, { payload: { projectDomain, projectType, type, payload } }) {
      const key = [projectDomain, projectType];
      return { ...state, [key]: domainTypeReducer(state[key], { type, payload }) };
    }
  },
  effects: {
    *dispatchDomainTypeEffect({ payload }, effects) {
      const { call } = effects;
      yield domainTypeEffectFunc(payload, effects);
    }
  }
};
