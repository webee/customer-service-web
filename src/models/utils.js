export function parseNSSubType(ns, type) {
  return (type && type.startsWith(ns)) ? type.substr(ns.length + 1) : type;
}

export function createNSSubReducer(ns, defaultState, reducers) {
  return (state = defaultState, action) => {
    const type = parseNSSubType(ns, action.type);
    const reducer = reducers[type];
    if (reducer) {
      return reducer(state, action);
    }
    return state;
  };
}

export function createNSSubEffectFunc(ns, effectFuncs) {
  return function*(action, effects) {
    const type = parseNSSubType(ns, action.type);
    const effectFunc = effectFuncs[type];
    if (effectFunc) {
      const { call } = effects;
      yield call(effectFunc, action, effects);
    }
  };
}
