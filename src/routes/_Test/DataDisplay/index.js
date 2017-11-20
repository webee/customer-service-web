import { Card, Badge, Icon } from "antd";
import SessionItem from '../Home/MyHandlingSessions/SessionItem';
import styles from "./index.less";

export default () => {
  return (
    <div className={styles.main}>
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
        <SessionItem name="测试" description="你妹的，好麻烦。。。" ts="刚刚"/>
        <SessionItem name="测试" description="你妹的，好麻烦。。。" ts="刚刚"/>
      </Card>
    </div>
  );
};
