import React from 'react';
import { Switch, Route, Redirect } from 'dva/router';
import { authRequired } from './auth_utils';
import {getRootPath} from './commons/router';
import MainLayout from './MainLayout';
import AuthPage from './AuthPage';
import NotFound from './NotFound';


export default function App({match}) {
  const root_path = getRootPath(match.path);
  return (
    <Switch>
      <Route path={`${root_path}/auth`} component={AuthPage}/>
      <Route path={`${root_path}`} key="root" render={authRequired(MainLayout)}/>
      <Redirect to={`${root_path}`}/>
    </Switch>
  );
};
