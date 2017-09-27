import { withRouter, Redirect } from 'dva/router';
import * as authService from '../services/auth';

export function authRequired(Component) {
  return withRouter(({location, ...props}) => {
    if (authService.isAuthenticated()) {
      return <Component {...props} key="xx"/>;
    }
    return <Redirect to={{pathname: '/auth', state: { from: location }}}/>;
  });
}
