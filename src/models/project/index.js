import { toPromiseEffects } from '../utils';
import { reducer as myHandlingReducer, effectFunc as myHandlingEffectFunc } from "./myHandling";
import { reducer as _Reducer, effectFunc as _EffectFunc } from "./_";

function domainTypeReducer(state = {}, action) {
  return {
    _: _Reducer(state._, action),
    myHandling: myHandlingReducer(state.myHandling, action)
  };
}

function* domainTypeEffectFunc(action, effects) {
  const { all, call } = effects;
  yield all([call(_EffectFunc, action, effects), call(myHandlingEffectFunc, action, effects)]);
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
  effects: toPromiseEffects({
    *dispatchDomainTypeEffect({ payload }, effects) {
      const { projectDomain, projectType } = payload;
      const key = [projectDomain, projectType];
      yield* domainTypeEffectFunc({ ...payload, key }, effects);
    }
  })
};
