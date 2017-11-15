import { Redirect } from 'dva/router';
import * as authService from '../services/auth';

export function authRequired(Component) {
  return (props) => {
    if (authService.isAuthenticated()) {
      return <Component {...props}/>;
    }
    return <Redirect to={{pathname: `/auth`, state: { from: props.location }}}/>;
  };
}
