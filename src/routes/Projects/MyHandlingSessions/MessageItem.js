import React from "react";
import cs from "classnames";
import { Icon } from "antd";
import Spinner from "react-spinkit";
import * as msgRendererService from "~/services/msgRenderer";
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
    return <Icon type={statusIconTypes[status]} />;
  }

  renderRawState(state) {
    // cooking进度
    const p = (state || {}).p || 0;
    return (
      <div className={styles.raw_state}>
        <Spinner name="circle" fadeIn="none" color="white" />
        <div style={{ width: 4 }} />
        {p}%
      </div>
    );
  }

  render() {
    const { position, userName, message, ctx } = this.props;
    const { domain, type, msg, state, status, ts, msgType } = message;
    const itemClassNames = cs(styles.item, {
      [styles.left]: position === "left",
      [styles.mid]: position === "mid",
      [styles.right]: position === "right"
    });
    const isRaw = msgType === "raw";
    const bodyClassNames = cs(styles.body, {
      [styles.raw]: isRaw
    });
    return (
      <div className={itemClassNames}>
        <div className={styles.info}>{this.renderStatus(status)}</div>
        <div className={styles.content}>
          <div className={styles.head}>{userName}</div>
          <div className={bodyClassNames}>
            {msgRendererService.renderMsg({ domain, type, msg }, ctx)}
            {isRaw && this.renderRawState(state)}
          </div>
        </div>
      </div>
    );
  }
}
