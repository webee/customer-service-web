import { Icon } from "antd";
import styles from "./index.less";

export default ({ type = "message", fontSize = 48, color = "#EDEFF2" }) => {
  return (
    <div className={styles.main}>
      <Icon type={type} style={{ fontSize, color }} />
    </div>
  );
};
