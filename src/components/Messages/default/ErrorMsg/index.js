import styles from "./index.less";

export default ({ type, content, as_description }) => {
  if (as_description) {
    return `[错误消息]`;
  }

  return (
    <div className={styles.main}>
      [错误消息]: [<span className={styles.msg}>
        {type}:{content}
      </span>]
    </div>
  );
};
