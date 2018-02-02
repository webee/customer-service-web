import { Divider } from "antd";
import styles from "./index.less";

export default ({ msg, as_description }) => {
  const { content } = msg;
  if (as_description) {
    return `[系统通知] ${content}`;
  }
  const { withDivider } = msg;
  if (withDivider) {
    return (
      <Divider>
        <span className={styles.main}>{content}</span>
      </Divider>
    );
  }
  return <div className={styles.main}>{content}</div>;
};
