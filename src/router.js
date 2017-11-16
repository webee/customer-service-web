import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import _Test from './entries/_Test';
import Auth from './entries/Auth';
import Main from './entries/Main';
import { authRequired } from './entries/auth_utils';
import { authPath } from './config';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/_" component={_Test} />
        <Route path={authPath} component={Auth} />
        <Route path="/" render={authRequired(authPath, Main)} />
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
