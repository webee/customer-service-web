import React from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import App from './components/App';
import TestApp from './components/TestApp';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/_" component={TestApp} />
        <Redirect to="/" />
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
