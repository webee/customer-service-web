import { Card, Button } from 'antd';


export default () => {
  return (
    <Card title="按钮展示">
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="danger">Danger</Button>
    </Card>
  );
};
