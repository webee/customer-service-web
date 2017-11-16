import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import * as authService from '../services/auth';

@connect()
class AuthRoute extends React.Component {
  render() {
    const { dispatch, Component, authPath, ...props } = this.props;
    if (authService.isAuthenticated()) {
      return <Component {...props}/>;
    }
    dispatch({type: 'auth/resetState'});
    const { location } = this.props;
    return <Redirect to={{pathname: authPath, state: { from: location }}}/>;
  }
}

export function authRequired(authPath, Component) {
  return (props) => (
    <AuthRoute Component={Component} authPath={authPath} {...props} />
  );
}
