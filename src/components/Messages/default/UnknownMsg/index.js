import styles from "./index.less";

export default ({ msg, err, as_description }) => {
  if (as_description) {
    return err ? `[错误] ${err.message}` : `[未知] ${msg}`;
  }

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
