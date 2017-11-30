import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import { Icon, Button, Badge } from "antd";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer";
import EmptyContent from "./EmptyContent";
import styles from "./MessageList.less";

export default class extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  state = {
    width: 0,
    isInRead: false,
    stopIndex: undefined
  };
  cache = new CellMeasurerCache({
    defaultHeight: 50,
    fixedWidth: true,
    keyMapper: (rowIndex, columnIndex) => {
      const { projMsgs: { msgs } } = this.props;
      const msg = msgs[rowIndex];
      return msg.msg_id;
    }
  });
  // list ref
  list = undefined;

  rowRenderer = ({ index, key, parent, style }) => {
    const { staffs, customers, projMsgs } = this.props;
    const { msgs } = projMsgs;
    const msg = msgs[index];
    const { type, content, user_type, user_id } = msg;
    let userName = user_id;
    switch (user_type) {
      case "staff":
        const staff = staffs[user_id];
        userName = staff ? staff.name : userName;
        break;
      case "customer":
        const customer = customers[user_id];
        userName = customer ? customer.name : userName;
        break;
    }
    // TODO: 基于type来渲染
    const itemClassNames = cs(styles.item, {
      [styles.left]: user_type === "customer",
      [styles.right]: user_type === "staff"
    });
    return (
      <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ measure }) => (
          <div style={style}>
            <div className={itemClassNames}>
              <div className={styles.head}>{userName}</div>
              <div className={styles.body}>{content}</div>
            </div>
          </div>
        )}
      </CellMeasurer>
    );
  };

  noRowsRenderer = () => <EmptyContent />;

  onResize = ({ width }) => {
    if (this.state.width !== width) {
      this.cache.clearAll();
      this.setState({ width });
    }
  };

  onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    // console.log('scroll: ', clientHeight, scrollHeight, scrollTop);
  };

  onRowsRendered = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
    const { session } = this.props;
    const msgs = this.props.projMsgs.msgs || [];
    const msg = msgs[stopIndex];
    const lastRowIndex = msgs.length - 1;
    const isInRead = stopIndex && lastRowIndex - stopIndex >= 1;
    this.setState({ isInRead, stopIndex });
    if (msg.msg_id > session.sync_msg_id) {
      dispatchDomainType(this.context, this.props, "_/updateSessionSyncMsgID", {
        id: session.id,
        sync_msg_id: msg.msg_id
      });
      dispatchDomainTypeEffect(this.context, this.props, "_/syncSessionMsgID", {
        projectID: session.project_id,
        sessionID: session.id,
        sync_msg_id: msg.msg_id
      });
    }
  };

  onDownClicked = () => {
    this._scrollToBottom();
  };

  render() {
    const { session, projMsgs } = this.props;
    const { isInRead } = this.state;
    const msgs = projMsgs.msgs || [];
    const lastRowIndex = msgs.length - 1;
    const scrollToIndex = isInRead ? undefined : lastRowIndex;
    return (
      <AutoSizer onResize={this.onResize}>
        {({ width, height }) => (
          <div className={styles.main} style={{ width, height }}>
            <List
              ref={i => (this.list = i)}
              className={styles.list}
              deferredMeasurementCache={this.cache}
              width={width}
              height={height}
              rowCount={msgs.length}
              scrollToIndex={scrollToIndex}
              onScroll={this.onScroll}
              onRowsRendered={this.onRowsRendered}
              rowHeight={this.cache.rowHeight}
              rowRenderer={this.rowRenderer}
              noRowsRenderer={this.noRowsRenderer}
            />
            {height >= 64 &&
              isInRead && (
                <Badge className={styles.down} count={session.msg_id - session.sync_msg_id}>
                  <Button ghost type="primary" shape="circle" icon="down" onClick={this.onDownClicked} />
                </Badge>
              )}
          </div>
        )}
      </AutoSizer>
    );
  }

  componentDidMount() {
    const { onSendObservable } = this.props;
    this.onSend = onSendObservable.subscribe(() => {
      this._scrollToBottom();
    });
  }

  componentWillUnmount() {
    this.onSend.unsubscribe();
  }

  _scrollToBottom() {
    const msgs = this.props.projMsgs.msgs || [];
    const lastRowIndex = msgs.length - 1;
    this.list.scrollToRow(lastRowIndex);
  }
}
