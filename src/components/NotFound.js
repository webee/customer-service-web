import { withRouter } from 'dva/router';


export default withRouter(({location}) => {
  return (
    <div>
      <h1>Pathname Not Found: {location.pathname}</h1>
		</div>
  );
});
