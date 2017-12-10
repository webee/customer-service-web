import styles from "./index.less";

export default ({ msg, err, className, style }) => {
  return err ? (
    <div className={styles.main}>
      [错误]: [<span className={styles.msg}>{err.message}</span>]
    </div>
  ) : (
    <div className={styles.main}>
      [未知消息]: [<span className={styles.msg}>{msg}</span>]
    </div>
  );
};
