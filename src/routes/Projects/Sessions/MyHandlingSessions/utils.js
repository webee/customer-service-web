export function genCustomerMobileName({ name, mobile }) {
  if (name && mobile) {
    return `${name}-${mobile}`;
  } else if (name) {
    return name;
  } else if (mobile) {
    return mobile;
  }
  return "";
}
