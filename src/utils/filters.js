export function extractFilter(filters, name, multi = true) {
  const values = filters[name];
  if (values) {
    return multi ? values : values[0];
  }
  return multi ? [] : undefined;
}
