import config from "~/config";
import { combineNSReducers, asNestedReducer, toPromiseEffects } from "../utils";
import { reducer as myHandlingReducer, effectFunc as myHandlingEffectFunc } from "./myHandling";
import { reducer as _Reducer, effectFunc as _EffectFunc } from "./_";
import * as msgCookService from "../../services/msgCook";
import FileUploadCook from "../../services/FileUploadCook";

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
      const { projectDomain, projectType } = payload;
      const { all, call, put } = effects;
      if (config.env !== "prod") {
        yield put({ type: `/${ns}/${projectDomain}/${projectType}/${payload.type}@@START`, payload: payload.payload });
      }
      yield all([call(_EffectFunc, payload, effects), call(myHandlingEffectFunc, payload, effects)]);
    }
  }),
  subscriptions: {
    txMsgCooking({ dispatch, history }) {
      function updateTxMsgCookingProgress({ createAction }, txMsg, p) {
        dispatch(createAction("_/updateTxMsgCookingProgress", { tx_id: txMsg.tx_id, p }));
      }

      const fileMsgTypes = new Set(["file", "image", "voice"]);
      msgCookService.registerDomainMsgCook(["", "cs"], new FileUploadCook(updateTxMsgCookingProgress, fileMsgTypes));
    }
  }
};
