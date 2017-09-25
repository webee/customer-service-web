import { Route, Switch, Redirect } from 'dva/router';
import Button from './Button';
import Icon from './Icon';


export default ({match}) => {
  return (
    <Switch>
      <Route path={`${match.path}/button`} component={Button}/>
      <Route path={`${match.path}/icon`} component={Icon}/>
      <Redirect to={`${match.path}/button`} />
    </Switch>
  );
};
