import { Redirect } from 'dva/router';
import * as authService from '../services/auth';

export function authRequired(authPath, Component) {
  return (props) => {
    if (authService.isAuthenticated()) {
      return <Component {...props}/>;
    }
    return <Redirect to={{pathname: {authPath}, state: { from: props.location }}}/>;
  };
}
