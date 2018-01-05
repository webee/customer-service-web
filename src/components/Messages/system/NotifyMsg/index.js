import styles from "./index.less";

export default ({ msg, as_description}) => {
  if (as_description) {
    return `[系统通知] ${msg}`;
  }
  return <div className={styles.main}>{msg}</div>;
};
