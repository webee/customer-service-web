import Spinner from "react-spinkit";
import styles from "./index.less";

export default ({ loaded = false, type = "line-spin-fade-loader", children, ...props }) => {
  return loaded ? (
    children
  ) : (
    <div className={styles.main}>
      <Spinner name={type} {...props} />
    </div>
  );
};
