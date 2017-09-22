import { withRouter, Switch, Redirect } from 'dva/router';


export default withRouter(({location}) => {
  return (
    <div>
      <h1>Not Found: {location.pathname}</h1>
		</div>
  );
});
