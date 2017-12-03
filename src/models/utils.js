export const NS_SEP = "/";

export function isNSType(ns, type) {
  return type && type.startsWith(`${ns}${NS_SEP}`);
}

export function parseNSSubType(ns, type) {
  return isNSType(ns, type) ? type.substr(ns.length + 1) : type;
}

export function parseNSFromType(type) {
  if (type) {
    const i = type.indexOf(NS_SEP);
    if (i >= 0) {
      return type.substr(0, i);
    }
  }
}

const INIT_ACTION_TYPES = ["", "@@INIT", undefined];
const identityReducer = (state, action) => state;

export function collectReducers(...reducers) {
  return (state, action) => reducers.reduce((state, reducer) => reducer(state, action), state);
}

export function collectTypeReducers(defaultState, reducers) {
  return (state = defaultState, { type, ...action }) => (reducers[type] || identityReducer)(state, { ...action, type });
}

function handleNSReduce(ns, reducer, state, type, action) {
  type = parseNSSubType(ns, type);
  if (ns === "") {
    // ns=''表示根空间
    return reducer(state, { ...action, type });
  }
  return { ...state, [ns]: reducer(state[ns], { ...action, type }) };
}

export function combineNSReducers(nsReducers) {
  return (state = {}, action) => {
    const ns = parseNSFromType(action.type);
    const reducer = nsReducers[ns];
    if (reducer) {
      return handleNSReduce(ns, reducer, state, action.type, action);
    }
    let newState = state;
    if (INIT_ACTION_TYPES.indexOf(action.type) >= 0) {
      // init
      for (let ns in nsReducers) {
        newState = handleNSReduce(ns, nsReducers[ns], newState, action.type, action);
      }
    }
    return newState;
  };
}

export function asNSReducer(ns, reducer) {
  return (state = {}, action) => {
    return handleNSReduce(ns, reducer, state, action.type, action);
  };
}

export function asNestedReducer(reducer, nestNSNames = []) {
  return (state = {}, { type, ...action }) => {
    const newState = { ...state };
    let nextState = newState;
    const nses = {};
    for (let n of nestNSNames) {
      const ns = parseNSFromType(type);
      if (!ns) {
        return state;
      }
      nses[n] = ns;
      nextState[ns] = { ...(nextState[ns] || {}) };
      nextState = nextState[ns];
      type = parseNSSubType(ns, type);
    }

    Object.assign(nextState, reducer(nextState, { ...action, ...nses, type }));
    return newState;
  };
}


export function collectTypeEffectFuncs(effectFuncs) {
  return function*(action, effects) {
    const effectFunc = effectFuncs[action.type];
    if (effectFunc) {
      yield* effectFunc(action, effects);
    }
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
        resolve(yield effectGen(action, effects));
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
  for (let e in effects) {
    promiseEffects[e] = asPromiseEffect(effects[e]);
  }
  return promiseEffects;
}
