import styles from "./index.less";

export default ({ msg }) => {
  return <div className={styles.main}>{msg.text}</div>;
};
