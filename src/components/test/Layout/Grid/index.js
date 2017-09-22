import { Row, Col, Card } from 'antd';
import styles from './index.less';


export default () => {
  return (
    <div>
      <h1>Grid栅格</h1>
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>Card content</Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
