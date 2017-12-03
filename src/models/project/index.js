import config from "~/config";
import { combineNSReducers, asNestedReducer, toPromiseEffects } from "../utils";
import { reducer as myHandlingReducer, effectFunc as myHandlingEffectFunc } from "./myHandling";
import { reducer as _Reducer, effectFunc as _EffectFunc } from "./_";

function* domainTypeEffectFunc(action, effects) {
  const { all, call } = effects;
  yield all([call(_EffectFunc, action, effects), call(myHandlingEffectFunc, action, effects)]);
}

const ns = "project";

export const reducer = asNestedReducer(
  combineNSReducers({
    _: _Reducer,
    myHandling: myHandlingReducer
  }),
  ["projectDomain", "projectType"]
);

export default {
  namespace: ns,
  state: {},
  reducers: {},
  effects: toPromiseEffects({
    *dispatchDomainTypeEffect({ payload }, effects) {
      yield domainTypeEffectFunc(payload, effects);
    }
  })
};
