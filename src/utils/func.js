export function seqFuncs(...funcs) {
  return (...args) => {
    funcs.forEach(f => {
      f(...args);
    });
  };
}

export function any(vals) {
  for (const val of vals) {
    if (val) {
      return true;
    }
  }
  return false;
}

export function anyIs(vals, func) {
  for (const val of vals) {
    if (func(val)) {
      return true;
    }
  }
  return false;
}
