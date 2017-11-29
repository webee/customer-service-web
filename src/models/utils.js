export function parseNSSubType(ns, type) {
  return type && type.startsWith(ns) ? type.substr(ns.length + 1) : type;
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
      yield* effectFunc(action, effects);
    }
  };
}

export function listToDict(list, byKey) {
  if (Array.isArray(list)) {
    const r = {};
    list.forEach(d => (r[byKey(d)] = d));
    return r;
  }
  return list;
}

export function promiseDispatch(dispatch, action) {
  return new Promise((resolve, reject) => {
    dispatch({ ...action, resolve, reject });
  });
}

export function asPromiseEffect(effectGen) {
  return function*({ resolve, reject, ...action }, effects) {
    if (resolve && reject) {
      try {
        resolve(yield* effectGen(action, effects));
      } catch (err) {
        reject(err);
      }
    } else {
        yield* effectGen(action, effects);
    }
  };
}

export function toPromiseEffects(effects) {
  const promiseEffects = {};
  for(let e in effects) {
    promiseEffects[e] = asPromiseEffect(effects[e]);
  }
  return promiseEffects;
}
