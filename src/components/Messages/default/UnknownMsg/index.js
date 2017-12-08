import cs from "classnames";
import styles from "./index.less";

export default ({ msg, className, style }) => {
  const classNames = cs(styles.main, className);
  return (
    <div className={classNames} style={style}>
      未知消息: [{msg}]
    </div>
  );
};
