import styles from "./index.less";

export default ({ msg, err, className, style }) => {
  return (
    <div className={styles.main}>
      {err
        ? ["[错误]: [", <span className={styles.msg}>{err.message}</span>, "]"]
        : ["[未知消息]: [", <span className={styles.msg}>{msg}</span>, "]"]}
    </div>
  );
};
