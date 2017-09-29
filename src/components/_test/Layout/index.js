import { Route, Switch, Redirect } from 'dva/router';
import Grid from './Grid';
import Blocks from './Blocks';


export default ({match}) => {
  return (
    <Switch>
      <Route path={`${match.path}/grid`} component={Grid}/>
      <Route path={`${match.path}/blocks`} component={Blocks}/>
      <Redirect to={`${match.path}/grid`} />
    </Switch>
  );
};
