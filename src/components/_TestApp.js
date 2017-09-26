import React from 'react';
import { Switch, Route } from 'dva/router';
import MainLayout from './_test/MainLayout';


export default function App() {
  return (
    <Switch>
      <Route path="" component={MainLayout}/>
    </Switch>
  );
}
