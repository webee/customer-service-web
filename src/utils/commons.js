export function delay(d) {
  return new Promise(resolve => setTimeout(resolve, d));
}
