import React from 'react';
import { Switch, Route } from 'dva/router';
import {getRootPath} from './commons/router';
import MainLayout from './_test/MainLayout';
import AuthPage from './AuthPage';


export default function App({match}) {
  const root_path = getRootPath(match.path);
  return (
    <Switch>
      <Route path={`${root_path}/auth`} component={AuthPage}/>
      <Route path={`${root_path}`} component={MainLayout}/>
    </Switch>
  );
}
