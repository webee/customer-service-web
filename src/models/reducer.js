import { combineNSReducers, collectReducers, asNSReducer } from "./utils";
import { reducer as projectReducer } from "./project";

function resetReducer(state, { type, payload }) {
  if (type === "RESET") {
    if (payload === "*") {
      // 清空所有
      return {};
    } else {
      // 清空指定的分支
      const newState = { ...state };
      payload.forEach(ns => {
        delete newState[ns];
      });
      return newState;
    }
  }
  return state;
}

export default asNSReducer(
  "",
  collectReducers(
    resetReducer,
    combineNSReducers({
      project: projectReducer
    })
  )
);
