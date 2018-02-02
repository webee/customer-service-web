import classnames from "classnames";
import { Divider } from "antd";
import styles from "./index.less";

export default ({ msg, as_description }) => {
  const { content } = msg;
  if (as_description) {
    return `[系统通知] ${content}`;
  }
  const classNames = classnames(styles.main, { [styles.bg]: msg.withBackground });
  const { withDivider } = msg;
  if (withDivider) {
    return (
      <Divider>
        <span className={classNames}>{content}</span>
      </Divider>
    );
  }
  return <div className={classNames}>{content}</div>;
};
