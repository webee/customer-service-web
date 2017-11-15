import { Card } from 'antd';
import { withRouter } from 'dva/router';


export default withRouter(({location}) => {
  return (
    <Card title="not found">
      <h1>Pathname Not Found: {location.pathname}</h1>
		</Card>
  );
});
