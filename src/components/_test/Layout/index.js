import { Route, Switch, Redirect } from 'dva/router';
import Grid from './Grid';


export default ({match}) => {
  return (
    <Switch>
      <Route path={`${match.path}/grid`} component={Grid}/>
      <Redirect to={`${match.path}/grid`} />
    </Switch>
  );
};
