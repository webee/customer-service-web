import React from "react";
import cs from "classnames";
import { Icon } from "antd";
import { StringMsg, TextMsg } from "~/components/Messages";
import styles from "./MessageItem.less";

const statusIconTypes = {
  pending: "check-square-o",
  cooking: "clock-circle-o",
  ready: "check-circle-o",
  sending: "loading",
  syncing: "sync",
  failed: "exclamation-circle"
};

export default class extends React.PureComponent {
  renderStatus(status) {
    return <Icon type={statusIconTypes[status]} />
  }

  render() {
    const { position, userName, ts, msg, status } = this.props;
    const itemClassNames = cs(styles.item, {
      [styles.left]: position === "left",
      [styles.mid]: position === "mid",
      [styles.right]: position === "right"
    });
    return (
      <div className={itemClassNames}>
        <div className={styles.info}>{this.renderStatus(status)}</div>
        <div className={styles.content}>
          <div className={styles.head}>{userName}</div>
          <StringMsg msg={msg} className={styles.body} />
        </div>
      </div>
    );
  }
}
