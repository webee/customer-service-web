import React from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import _TestApp from './components/_TestApp';
import App from './components/App';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/_" component={_TestApp} />
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
