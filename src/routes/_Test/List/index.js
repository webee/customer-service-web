import { Card, Badge, Avatar, Icon, List } from "antd";
import styles from "./index.less";

const data = [
  {
    title: "Ant Design Title 1",
    description: "Ant Design, a design"
  },
  {
    title: "Ant Design Title 2",
    description: "language for background applications"
  },
  {
    title: "Ant Design Title 3",
    description: "is refined by Ant UED Team"
  },
  {
    title: "Ant Design Title 4",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team"
  }
];

export default () => {
  return (
    <div className={styles.main}>
      <Card title="列表" bordered={false}>
        <List
          bordered={false}
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<a href="https://ant.design">{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card title={item.title}>Card content</Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
