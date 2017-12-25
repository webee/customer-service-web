export function shadowEqual(a, b) {
  if (a && b) {
    for (const k in b) {
      if (a[k] != b[k]) {
        return false;
      }
    }
  }
  return true;
}


export function removeUndefined(o) {
  const n = {...o};
  Object.keys(n).forEach(key => n[key] === undefined && delete n[key])
  return n;
}
