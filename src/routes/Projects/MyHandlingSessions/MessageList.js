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

export default class extends React.PureComponent {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      isInRead: false
    };
    this.mesuredRowIndex = 0;
    this.scrollTop = 0;
    this.scrollDirection = 0;
    this.width = 0;
    this.cache = new CellMeasurerCache({
      defaultHeight: 50,
      fixedWidth: true,
      keyMapper: (rowIndex, columnIndex) => {
        const { projMsgs, projTxMsgIDs, txMsgs, isCurrentOpened } = this.props;
        const messages = projMsgs.msgs;
        const tx_messages = projTxMsgIDs.map(tx_id => txMsgs[tx_id]);
        let message = messages[rowIndex];
        if (rowIndex >= messages.length) {
          message = tx_messages[rowIndex - messages.length];
        }
        return message.msg_id;
      }
    });
    // list ref
    this.list = undefined;
  }

  rowRenderer = ({ index, key, parent, style }) => {
    const { width } = parent.props;
    const { staffs, customers, projMsgs, projTxMsgIDs, txMsgs } = this.props;
    const messages = projMsgs.msgs;
    const tx_messages = projTxMsgIDs.map(tx_id => txMsgs[tx_id]);
    let message = messages[index];
    if (index >= messages.length) {
      message = tx_messages[index - messages.length];
    }
    const { domain, type, msg, user_type, user_id, ts, status } = message;
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
            <MessageItem
              ctx={{ measure, width, index }}
              position={position}
              userName={userName}
              ts={ts}
              domain={domain}
              type={type}
              msg={msg}
              status={status}
            />
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
    const { session, isCurrentOpened } = this.props;
    if (!isCurrentOpened) {
      return;
    }

    const { scrollTop: prevScrollTop, isInRead: prevIsInRead } = this.state;
    const scrollDirection = scrollTop - prevScrollTop;
    this.scrollTop = scrollTop;
    this.scrollDirection = scrollDirection;

    if (clientHeight > 0) {
      let isInRead = prevIsInRead;
      if (prevIsInRead) {
        // 由阅读状态进入非阅读状态
        isInRead = !(clientHeight + scrollTop >= scrollHeight);
      } else {
        // 由非阅读状态进入阅读状态
        isInRead = clientHeight + scrollTop + 20 < scrollHeight;
      }
      if (prevIsInRead !== isInRead) {
        // console.log("scroll: ", clientHeight, scrollHeight, scrollTop);
        this.setState({ isInRead });
        dispatchDomainType(this.context, this.props, "myHandling/updateOpenedSessionState", {
          id: session.id,
          sessionState: { isInRead }
        });
      }
    }
  };

  onRowsRendered = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
    const { session, isCurrentOpened } = this.props;
    if (!isCurrentOpened) {
      return;
    }
    // console.log("render: ", startIndex, stopIndex);

    const messages = this.props.projMsgs.msgs || [];
    // const { isInRead: prevIsInRead } = this.state;
    // const scrollDirection = this.scrollDirection;
    // // isInRead以rx区的消息为准
    // let isInRead = prevIsInRead;
    // if (!prevIsInRead) {
    //   isInRead = scrollDirection <= 0 && stopIndex && messages.length - 1 - stopIndex >= 1;
    // } else {
    //   // 有发送消息
    //   isInRead = scrollDirection > 0 && stopIndex && messages.length - 1 - stopIndex < 0;
    // }
    // if (prevIsInRead !== isInRead) {
    //   console.log("render: ", startIndex, stopIndex);
    //   this.setState({ isInRead });
    // dispatchDomainType(this.context, this.props, "myHandling/updateOpenedSessionState", {
    //   id: session.id,
    //   sessionState: { isInRead }
    // });
    // }

    // 同步已读消息id
    const message = messages[stopIndex < messages.length ? stopIndex : messages.length - 1];
    this._syncMsgID(message.msg_id);
  };

  onDownClicked = () => {
    this._scrollToBottom();
  };

  render() {
    const { session, projMsgs, projTxMsgIDs, txMsgs, isCurrentOpened } = this.props;
    const { rowCount: prevRowCount, isInRead } = this.state;
    const messages = projMsgs.msgs || [];
    const tx_messages = projTxMsgIDs.map(tx_id => txMsgs[tx_id]);
    const rowCount = messages.length + tx_messages.length;
    const lastRowIndex = rowCount - 1;
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
                rowCount={rowCount}
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
                  <Button
                    className={styles.down}
                    ghost
                    type="primary"
                    shape="circle"
                    icon="down"
                    onClick={this.onDownClicked}
                  />
                  // </Badge>
                )}
            </div>
          );
        }}
      </AutoSizer>
    );
  }

  _calcRowIndex(props) {
    const { projMsgs, projTxMsgIDs } = props;
    const messages = projMsgs.msgs || [];
    return messages.length + projTxMsgIDs.length - 1;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isCurrentOpened) {
      const mesuredRowIndex = this.mesuredRowIndex;
      const rowIndex = this._calcRowIndex(this.props);
      if (rowIndex > mesuredRowIndex) {
        for (let i = mesuredRowIndex; i <= rowIndex; i++) {
          if (this.cache.rowHeight({ index: i }) === 0) {
            this.cache.clear(i, 0);
          }
        }
        this.mesuredRowIndex = rowIndex;
        this.forceUpdate();
      }
    }
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

  _syncMsgID(msg_id) {
    const { session } = this.props;
    if (msg_id > session.sync_msg_id) {
      dispatchDomainType(this.context, this.props, "_/updateSessionSyncMsgID", {
        id: session.id,
        sync_msg_id: msg_id
      });
      projectWorkers.syncSessionMsgID(this.context, this.props, session.project_id, session.id, msg_id);
    }
  }
}
