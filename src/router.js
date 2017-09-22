import React from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import App from './components/App';
import TestApp from './components/TestApp';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/_" component={TestApp} />
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
