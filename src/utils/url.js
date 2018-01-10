import qs from "qs";

export function parseQueryFromSearch(search) {
  return qs.parse(search.replace(/^(\?|\ )+/, ""));
}

export function encodeQueryToSearch(query, withQueryMark = true) {
  return `${withQueryMark ? "?" : ""}${qs.stringify(query)}`;
}
