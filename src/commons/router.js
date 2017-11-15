import { withRouter, Route } from 'dva/router';


export function getRootPath(path) {
  return path.endsWith('/') ? path.substr(0, path.length - 1) : path;
}
