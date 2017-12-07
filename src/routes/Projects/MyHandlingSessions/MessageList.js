import React from "react";
import PropTypes from "prop-types";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import * as projectWorkers from "~/services/projectWorkers";
import { Icon, Button, Badge } from "antd";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer";
import EmptyContent from "./EmptyContent";
import MessageItem from "./MessageItem";
import styles from "./MessageList.less";

export default class extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  state = {
    isInRead: false,
    scrollTop: 0,
    scrollDirection: 0
  };
  width = 0;
  cache = new CellMeasurerCache({
    defaultHeight: 50,
    fixedWidth: true
    // keyMapper: (rowIndex, columnIndex) => {
    //   const { projMsgs: { msgs } } = this.props;
    //   const msg = msgs[rowIndex];
    //   return msg.msg_id;
    // }
  });
  // list ref
  list = undefined;

  rowRenderer = ({ index, key, parent, style }) => {
    const { staffs, customers, projMsgs, projTxMsgIDs, txMsgs } = this.props;
    const messages = projMsgs.msgs;
    const tx_messages = projTxMsgIDs.map(tx_id => txMsgs[tx_id]);
    let message = messages[index];
    if (index >= messages.length) {
      message = tx_messages[index - messages.length];
    }
    const { domain, type, content, user_type, user_id, ts, status } = message;
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
    let position = "mid";
    if (user_type === "customer") {
      position = "left";
    } else if (user_type === "staff") {
      position = "right";
    }
    return (
      <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ measure }) => (
          <div style={style}>
            <MessageItem position={position} userName={userName} ts={ts} msg={content} status={status} />
          </div>
        )}
      </CellMeasurer>
    );
  };

  noRowsRenderer = () => <EmptyContent />;

  onResize = ({ width }) => {
    if (this.width !== width) {
      this.cache.clearAll();
      this.width = width;
    }
  };

  onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    const { scrollTop: prevScrollTop } = this.state;
    this.setState({ scrollTop, scrollDirection: scrollTop - prevScrollTop });
  };

  onRowsRendered = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
    const { session, isCurrentOpened } = this.props;
    if (!isCurrentOpened) {
      return;
    }

    const { scrollDirection, isInRead: prevIsInRead } = this.state;
    const messages = this.props.projMsgs.msgs || [];
    // isInRead以rx区的消息为准
    let isInRead = stopIndex && messages.length - 1 - stopIndex >= 1;
    if (!prevIsInRead) {
      isInRead = scrollDirection <= 0 && isInRead;
    }
    if (prevIsInRead !== isInRead) {
      this.setState({ isInRead });
      dispatchDomainType(this.context, this.props, "myHandling/updateCurrentOpenedSessionState", { isInRead });
    }

    if (stopIndex < messages.length) {
      const message = messages[stopIndex];
      // 同步已读消息id
      if (message.msg_id > session.sync_msg_id) {
        dispatchDomainType(this.context, this.props, "_/updateSessionSyncMsgID", {
          id: session.id,
          sync_msg_id: message.msg_id
        });
        console.log('msg_id: ', message.msg_id);
        projectWorkers.syncSessionMsgID(this.context, this.props, session.project_id, session.id, message.msg_id);
      }
    }
  };

  onDownClicked = () => {
    this._scrollToBottom();
  };

  render() {
    const { session, projMsgs, projTxMsgIDs, txMsgs, isCurrentOpened } = this.props;
    const { isInRead } = this.state;
    const messages = projMsgs.msgs || [];
    const tx_messages = projTxMsgIDs.map(tx_id => txMsgs[tx_id]);
    const lastRowIndex = messages.length + tx_messages.length - 1;
    // 解决向上滑动的bug
    const scrollToIndex = isInRead ? undefined : lastRowIndex;
    return (
      <AutoSizer onResize={this.onResize}>
        {({ width, height }) => {
          // FIXME: 高度变成0之后不能再检查到改变
          // console.log({width, height});
          return (
            <div className={styles.main} style={{ width, height }}>
              <List
                ref={i => (this.list = i)}
                className={styles.list}
                deferredMeasurementCache={this.cache}
                width={width}
                height={height}
                rowCount={messages.length + tx_messages.length}
                scrollToIndex={scrollToIndex}
                scrollToAlignment="end"
                onScroll={this.onScroll}
                onRowsRendered={this.onRowsRendered}
                rowHeight={this.cache.rowHeight}
                rowRenderer={this.rowRenderer}
                noRowsRenderer={this.noRowsRenderer}
                isCurrentOpened={isCurrentOpened}
                tx_messages={tx_messages}
              />
              {height >= 64 &&
                isInRead && (
                  // <Badge className={styles.down} count={session.msg_id - session.sync_msg_id}>
                    <Button className={styles.down} ghost type="primary" shape="circle" icon="down" onClick={this.onDownClicked} />
                  // </Badge>
                )}
            </div>
          );
        }}
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
    const messages = this.props.projMsgs.msgs || [];
    const txMsgIDs = this.props.projTxMsgIDs;
    const lastRowIndex = messages.length + txMsgIDs.length - 1;
    this.list.scrollToRow(lastRowIndex);
  }
}
