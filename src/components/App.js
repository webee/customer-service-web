import React from 'react';
import { Switch, Route } from 'dva/router';
import MainLayout from './MainLayout';
import AuthPage from './AuthPage';
import NotFound from './NotFound';


export default function App() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage}/>
      <Route path="" component={MainLayout}/>
      <Route component={NotFound}/>
    </Switch>
  );
};
