import React from 'react';
import { Switch, Route, Redirect } from 'dva/router';
import { authRequired } from './auth_utils';
import MainLayout from './MainLayout';
import AuthPage from './AuthPage';
import NotFound from './NotFound';


export default function App({match}) {
  return (
    <Switch>
      <Route path={`${match.path}/auth`} component={AuthPage}/>
      <Route path={`${match.path}`} key="root" render={authRequired(MainLayout)}/>
      <Redirect to={`${match.path}`}/>
    </Switch>
  );
};
