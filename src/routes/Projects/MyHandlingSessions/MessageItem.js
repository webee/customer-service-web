import React from "react";
import cs from "classnames";
import { Icon } from "antd";
import Spinner from "react-spinkit";
import moment from "moment";
import * as msgRendererService from "~/services/msgRenderer";
import styles from "./MessageItem.less";

const statusIconTypes = {
  pending: "check-square-o",
  cooking: "clock-circle-o",
  ready: "check-circle-o",
  sending: "loading",
  syncing: "sync",
  failed: { type: "exclamation-circle", style: { color: "red" } }
};

export default class extends React.PureComponent {
  renderStatus(status) {
    let t = statusIconTypes[status];
    t = typeof t === "string" ? { type: t, style: {} } : t;
    return <Icon {...t} />;
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

  renderFailed(message, is_failed) {
    const { handleFailedMsg } = this.props;
    if (is_failed) {
      return <Icon type="close-circle" style={{ fontSize: 24, color: "red", margin: 8 }} onClick={handleFailedMsg} />;
    }
  }

  render() {
    const { position, userName, message, ctx, onClickMsg } = this.props;
    const { domain, type, msg_id, msg, state, status, ts, msgType, is_failed } = message;
    const position_right = position === "right";
    const itemClassNames = cs(styles.item, {
      [styles.left]: position === "left",
      [styles.mid]: position === "mid",
      [styles.right]: position_right
    });
    const isRaw = msgType === "raw";
    const bodyClassNames = cs(styles.body, {
      [styles.raw]: isRaw
    });
    return (
      <div className={itemClassNames}>
        <div className={styles.info}>{this.renderStatus(status)}</div>
        <div className={styles.content}>
          <div className={styles.head}>
            {userName}
            <span className={styles.ts}>{moment.unix(ts).format("YYYY-MM-DD hh:mm:ss")}</span>
          </div>
          <div className={styles.decorate}>
            <div className={bodyClassNames} onClick={onClickMsg}>
              {msgRendererService.renderMsg({ domain, type, msg }, ctx)}
              {isRaw && status !== "failed" && this.renderRawState(state)}
            </div>
            {position_right && this.renderFailed(message, is_failed)}
          </div>
        </div>
      </div>
    );
  }
}
