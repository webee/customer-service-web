import { Divider } from "antd";
import styles from "./index.less";

export default ({ msg, as_description }) => {
  if (as_description) {
    return `[系统分隔] ${msg}`;
  }
  return (
    <Divider>
      <span className={styles.main}>{msg}</span>
    </Divider>
  );
};
