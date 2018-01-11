import { Dropdown, Menu, Card, Button, Badge, Icon } from "antd";
import SessionItem from "../Chat/MyHandlingSessions/SessionItem";
import styles from "./index.less";

const sendMenu = (
  <Menu>
    <Menu.Item key="1">enter发送</Menu.Item>
    <Menu.Item key="2">shift+enter发送</Menu.Item>
  </Menu>
);

export default () => {
  return (
    <div className={styles.main}>
      <Card title="消息气泡" />
      <Card title="徽标" bordered={false}>
        <Badge count={13}>
          <Icon type="code" className={styles.icon} />
        </Badge>
        <Badge count={0} showZero>
          <Icon type="code" className={styles.icon} />
        </Badge>
        <Badge count={5}>
          <a href="#" className={styles.head} />
        </Badge>
        <Badge count={0} showZero>
          <a href="#" className={styles.head} />
        </Badge>
        <br />
        <Badge dot={true}>
          <Icon type="code" className={styles.icon} />
        </Badge>
        <br />
        <Badge status="success" text="小明" />
        <br />
        <Badge status="processing" text="小王" />
        <br />
        <Badge status="error" text="小易" />
      </Card>
      <Card>
        <Badge count={25} />
        <Badge
          count={4}
          style={{
            backgroundColor: "#fff",
            color: "#999",
            boxShadow: "0 0 0 1px #d9d9d9 inset"
          }}
        />
        <Badge count={109} style={{ backgroundColor: "#87d068" }} />
      </Card>
      <Card>
        <Badge count={99}>
          <Icon type="code" className={styles.icon} />
        </Badge>
        <Badge count={100}>
          <Icon type="code" className={styles.icon} />
        </Badge>
        <Badge count={99} overflowCount={10}>
          <Icon type="code" className={styles.icon} />
        </Badge>
        <Badge count={1000} overflowCount={999}>
          <Icon type="code" className={styles.icon} />
        </Badge>
      </Card>
      <Card>
        <SessionItem name="测试" description="你妹的，好麻烦。。。" ts="刚刚" />
        <SessionItem name="测试" description="你妹的，好麻烦。。。" ts="刚刚" />
      </Card>
      <Card>
        <Dropdown.Button type="primary" overlay={sendMenu}>
          发送
        </Dropdown.Button>
      </Card>
    </div>
  );
};
