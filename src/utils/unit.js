const B = 1;
const K = B * 1024;
const M = K * 1024;
const G = M * 1024;
const T = G * 1024;
const UNIT_LEVELS = [["B", B], ["K", K], ["M", M], ["G", G], ["T", T]];
const UNDEFINED_LEVEL = [undefined, 0];

export function prettyByteSize(b) {
  for (let l = 0; l < UNIT_LEVELS.length; l++) {
    const [u, q] = UNIT_LEVELS[l];
    const [nextU, nextQ] = UNIT_LEVELS[l + 1] || UNDEFINED_LEVEL;
    if (b < nextQ) {
      const v = b / q;
      if (v < 1000) {
        return `${v.toPrecision(3)/1}${u}`;
      }
      return `${v.toPrecision(4)/1}${u}`;
    }
  }
  return `${b}B`;
}
