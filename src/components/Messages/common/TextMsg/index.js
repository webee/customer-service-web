import styles from "./index.less";

export default ({ msg, as_description}) => {
  if (as_description) {
    return msg.text;
  }

  return <div className={styles.main}>{msg.text}</div>;
};
