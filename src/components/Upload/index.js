import styles from "./index.less";

export default ({ children, ...props }) => {
  return (
    <div className={styles.main}>
      <input {...props} type="file" />
      {children}
    </div>
  );
};
