import React from "react";
import { Redirect } from "dva/router";
import { parseQueryFromSearch, encodeQueryToSearch } from "../utils/url";
import { connect } from "dva";
import * as authService from "../services/auth";

@connect()
class AuthRoute extends React.PureComponent {
  render() {
    const { dispatch, Component, authPath, ...props } = this.props;
    const { location } = this.props;
    console.debug("location: ", location);
    const query = parseQueryFromSearch(location.search);
    if (!query.jwt) {
      // 没有带jwt，则检查当前jwt
      if (authService.isAuthenticated()) {
        return <Component {...props} />;
      }
      dispatch({ type: "auth/resetState" });
      return <Redirect to={{ pathname: authPath, state: { from: location } }} />;
    }
    // 带有jwt
    const { jwt } = query;
    delete query.jwt;
    const search = encodeQueryToSearch({ jwt });
    const state = { from: { ...location, search: encodeQueryToSearch(query) } };
    return <Redirect to={{ pathname: `${authPath}/logout`, state: { search, state } }} />;
  }
}

export function authRequired(authPath, Component) {
  return props => <AuthRoute Component={Component} authPath={authPath} {...props} />;
}
