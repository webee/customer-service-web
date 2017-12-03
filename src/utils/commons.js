export function delay(d) {
  return new Promise(resolve => setTimeout(resolve, d));
}

export function yieldGen(g) {
  let done;
  do {
    const res = g.next();
    done = res.done;
  } while (!done);
}

export function yieldFunc(f) {
  yieldGen(f());
}

export function asYieldFunc(f) {
  return () => yieldFunc(f);
}
