import { reducer as myHandlingReducer, effectFunc as myHandlingEffectFunc } from "./myHandling";

function domainTypeReducer(state = {}, action) {
  return {
    myHandling: myHandlingReducer(state.myHandling, action)
  };
}

function* domainTypeEffectFunc(action, effects) {
  const { all, call } = effects;
  yield all([call(myHandlingEffectFunc, action, effects)]);
}

export default {
  namespace: "project",

  state: {},
  reducers: {
    dispatchDomainType(state, { payload }) {
      const { projectDomain, projectType } = payload;
      const key = [projectDomain, projectType];
      return { ...state, [key]: domainTypeReducer(state[key], { ...payload, key }) };
    }
  },
  effects: {
    *dispatchDomainTypeEffect({ payload }, effects) {
      const { projectDomain, projectType } = payload;
      const key = [projectDomain, projectType];
      const { call } = effects;
      yield call(domainTypeEffectFunc, { ...payload, key }, effects);
    }
  }
};
