import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import { STRING_MSG_TYPE } from "~/libs/MsgCodecs/DefaultMsgCodec";
import * as projectWorkers from "~/services/projectWorkers";
import { Icon, Button, Badge } from "antd";
import moment from "moment";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { InfiniteLoader, List } from "react-virtualized";
import Lightbox from "react-image-lightbox";
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer";
import EmptyContent from "./EmptyContent";
import MessageItem from "./MessageItem";
import styles from "./MessageList.less";

const ROW_OFFSET = 1;
const LOADING_MSG = { msg_id: -1, type: STRING_MSG_TYPE, msg: "加载中..." };
const NO_MORE_MSG = { msg_id: -2, type: STRING_MSG_TYPE, msg: "没有更多消息了" };

export default class extends React.PureComponent {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      isInRead: false,
      lightboxIsOpen: false,
      lightboxImageIndex: 0,
      images: this._calcImages(props.projMsgs.msgs || [])
    };
    this.mesuredRowIndex = 0;
    this.clientHeight = 0;
    this.scrollTop = 0;
    this.scrollHeight = 0;
    this.scrollDirection = 0;
    this.msg_id = undefined;
    this.msg_index = undefined;
    this.width = 0;
    this.cache = new CellMeasurerCache({
      defaultHeight: 50,
      fixedWidth: true,
      keyMapper: (rowIndex, columnIndex) => {
        const message = this.getMessage(rowIndex);
        if (message) {
          return `msg:${message.msg_id}`;
        }
        return rowIndex;
      }
    });
    // list ref
    this.list = undefined;
  }

  handleFailedMsg = msg => () => {
    const { session } = this.props;
    dispatchDomainTypeEffect(this.context, this.props, "_/resendFailedMsg", {
      projectID: session.project_id,
      sessionID: session.id,
      msg
    });
  };

  onClickMsg = msg => () => {
    const { type, msg_id } = msg;
    if (type === "image") {
      let lightboxImageIndex = 0;
      for (let i = 0; i < this.state.images.length; i++) {
        const img = this.state.images[i];
        if (img.msg_id === msg_id) {
          lightboxImageIndex = i;
          break;
        }
      }
      this.setState({ lightboxIsOpen: true, lightboxImageIndex });
    }
  };

  getUserName(message) {
    const { staffs, customers } = this.props;
    const { user_type, user_id } = message;
    let userName = user_id;
    switch (user_type) {
      case "staff":
        const staff = staffs[user_id];
        userName = staff ? staff.name : userName;
        break;
      case "customer":
        const customer = customers[user_id];
        userName = customer ? customer.name || customer.mobile : userName;
        break;
    }
    return userName;
  }

  getRowCount = () => {
    return ROW_OFFSET + this.getActualRowCount();
  };

  getActualRowCount = () => {
    const { projMsgs, projTxMsgIDs, txMsgs } = this.props;
    const messages = projMsgs.msgs || [];
    const tx_messages = projTxMsgIDs.map(tx_id => txMsgs[tx_id]);
    return messages.length + tx_messages.length;
  };

  getMessage = index => {
    const { projMsgs, projTxMsgIDs, txMsgs } = this.props;
    const messages = projMsgs.msgs || [];
    const tx_messages = projTxMsgIDs.map(tx_id => txMsgs[tx_id]);
    const actual_index = index - ROW_OFFSET;
    if (actual_index >= messages.length) {
      return tx_messages[actual_index - messages.length];
    }
    if (actual_index < 0) {
      if (projMsgs.noMore) {
        return NO_MORE_MSG;
      }
      return LOADING_MSG;
    }
    return messages[actual_index];
  };

  getMsgIndex = msg_id => {
    if (!msg_id) {
      return undefined;
    }
    const { projMsgs } = this.props;
    const messages = projMsgs.msgs || [];
    for (const i in messages) {
      const msg = messages[i];
      if (msg.msg_id === msg_id) {
        return parseInt(i) + ROW_OFFSET;
      }
    }
  };

  rowRenderer = ({ index, key, parent, style }) => {
    const { width } = parent.props;
    const { staffs, customers, projMsgs, projTxMsgIDs, txMsgs } = this.props;
    const message = this.getMessage(index);

    const { user_type } = message;
    let userName = this.getUserName(message);
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
              message={message}
              handleFailedMsg={this.handleFailedMsg(message)}
              onClickMsg={this.onClickMsg(message)}
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
    // console.debug("onScroll: ", clientHeight, scrollHeight, scrollTop);
    const { session, isCurrentOpened } = this.props;

    const { isInRead: prevIsInRead } = this.state;
    const prevScrollTop = this.scrollTop;
    const scrollDirection = scrollTop - prevScrollTop;
    this.clientHeight = clientHeight;
    this.scrollTop = scrollTop;
    this.scrollHeight = scrollHeight;
    this.scrollDirection = scrollDirection;

    if (!isCurrentOpened) {
      return;
    }

    if (clientHeight > 0) {
      let isInRead = prevIsInRead;
      if (prevIsInRead) {
        // 由阅读状态进入非阅读状态
        isInRead = !(clientHeight + scrollTop >= scrollHeight);
      } else {
        // 由非阅读状态进入阅读状态
        isInRead = clientHeight + scrollTop + 10 < scrollHeight;
      }
      this._updateIsInReadState(isInRead);
    }
  };

  onRowsRendered = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
    const { session, isCurrentOpened, projMsgs } = this.props;
    if (!isCurrentOpened) {
      return;
    }
    const scrollDirection = this.scrollDirection;
    console.debug("onRowsRendered: ", overscanStartIndex, overscanStopIndex, startIndex, stopIndex, scrollDirection);
    if (scrollDirection <= 0) {
      if (overscanStartIndex === 0 && this.msg_id === undefined) {
        // console.debug("loadProjectMsgs");
        // projectWorkers.loadProjectMsgs(this.context, this.props, session.project_id);
        // const message = this.getMessage(startIndex > 0 ? startIndex : 1);
        // if (message) {
        //   this.msg_id = message.msg_id;
        //   this.msg_index = startIndex;
        // }
      }
    }
    // const msg_index = this.getMsgIndex(this.msg_id);
    // console.log("yyyyyyyyyyyyyyyyyyyyyyy: ", this.msg_id, msg_index, this.msg_index);
    // if (
    //   projMsgs.noMore ||
    //   (msg_index !== undefined && msg_index > this.msg_index && msg_index >= startIndex && msg_index <= stopIndex)
    // ) {
    //   this.msg_id = undefined;
    //   this.msg_index = undefined;
    // }

    const messages = projMsgs.msgs || [];
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
    if (message) {
      this._syncMsgID(message.msg_id);
    }
  };

  onDownClicked = () => {
    this._scrollToBottom();
  };

  renderLightbox() {
    const { lightboxImageIndex, images } = this.state;
    const image = images[lightboxImageIndex];
    const { msg, name } = image;
    const ts = moment.unix(msg.ts).format();
    const imageCaption = `${ts}: ${name}`;
    const imageTitle = `${lightboxImageIndex + 1}/${images.length}`;
    return (
      <Lightbox
        mainSrc={image.url}
        nextSrc={images[(lightboxImageIndex + 1) % images.length].url}
        prevSrc={images[(lightboxImageIndex + images.length - 1) % images.length].url}
        imageTitle={imageTitle}
        imageCaption={imageCaption}
        onCloseRequest={() => this.setState({ lightboxIsOpen: false })}
        onMovePrevRequest={() =>
          this.setState({
            lightboxImageIndex: (lightboxImageIndex + images.length - 1) % images.length
          })
        }
        onMoveNextRequest={() =>
          this.setState({
            lightboxImageIndex: (lightboxImageIndex + 1) % images.length
          })
        }
      />
    );
  }

  renderList(rowCount, { width, height }) {
    const { session, projMsgs, projTxMsgIDs, isCurrentOpened } = this.props;
    const { isInRead } = this.state;
    const lastRowIndex = rowCount - 1;
    // 解决向上滑动的bug
    const scrollToIndex = isInRead ? undefined : lastRowIndex;
    // const scrollToIndex = isInRead ? this.getMsgIndex(this.msg_id) : lastRowIndex;
    this.msg_id = scrollToIndex !== undefined ? this.getMessage(scrollToIndex).msg_id : undefined;
    console.log("xxxxxxxxxxxxxxx: ", isInRead, this.msg_id, scrollToIndex);
    return (
      <Fragment>
        {this.state.lightboxIsOpen && this.renderLightbox()}
        <List
          ref={i => {
            this.list = i;
          }}
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
          projTxMsgIDs={projTxMsgIDs}
          projMsgs={projMsgs}
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
      </Fragment>
    );
  }

  render() {
    const rowCount = this.getRowCount();
    return (
      <AutoSizer onResize={this.onResize}>
        {({ width, height }) => {
          // FIXME: 高度变成0之后不能再检查到改变
          // console.log({width, height});
          return (
            <div className={styles.main} style={{ width, height }}>
              {rowCount <= ROW_OFFSET ? this.noRowsRenderer() : this.renderList(rowCount, { width, height })}
            </div>
          );
        }}
      </AutoSizer>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isCurrentOpened && !nextProps.isCurrentOpened) {
      // 不是当前打开标签，则默认进入阅读模式
      this._updateIsInReadState(true);
    } else if (!this.props.isCurrentOpened && nextProps.isCurrentOpened) {
      if (this.state.isInRead) {
        if (this.clientHeight + this.scrollTop >= this.scrollHeight) {
          this._updateIsInReadState(false);
        }
      }
    }
    const nextMsgs = nextProps.projMsgs.msgs || [];
    const nextMsgCount = nextMsgs.length;
    const msgCount = (this.props.projMsgs.msgs || []).length;
    if (nextMsgCount !== msgCount) {
      this.setState({ images: this._calcImages(nextMsgs) });
    }
  }

  _calcImages(msgs) {
    return msgs.filter(m => m.type === "image").map(m => ({
      msg_id: m.msg_id,
      url: m.msg.url,
      name: m.msg.name,
      msg: m
    }));
  }

  _updateIsInReadState(isInRead) {
    if (this.state.isInRead !== isInRead) {
      const { session } = this.props;
      // console.log("scroll: ", clientHeight, scrollHeight, scrollTop);
      this.setState({ isInRead });
      dispatchDomainType(this.context, this.props, "myHandling/updateOpenedSessionState", {
        id: session.id,
        sessionState: { isInRead }
      });
    }
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
      this._updateIsInReadState(false);
    });
  }

  componentWillUnmount() {
    this.onSend.unsubscribe();
  }

  _scrollToBottom() {
    const rowCount = this.getRowCount();
    const lastRowIndex = rowCount - 1;
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