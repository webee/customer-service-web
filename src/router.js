import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import _Test from './entries/_Test';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/_" component={_Test} />
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
