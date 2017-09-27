import React from 'react';
import { Switch, Route } from 'dva/router';
import MainLayout from './_test/MainLayout';
import AuthPage from './AuthPage';


export default function App({match}) {
  return (
    <Switch>
      <Route path={`${match.path}/auth`} component={AuthPage}/>
      <Route path={`${match.path}`} component={MainLayout}/>
    </Switch>
  );
}
