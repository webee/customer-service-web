export function seqFuncs(...funcs) {
  return (...args) => {
    funcs.forEach(f => {
      f(...args);
    });
  };
}
