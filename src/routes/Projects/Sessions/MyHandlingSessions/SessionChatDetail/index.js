import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import SplitPane from "react-split-pane";
import List from "react-virtualized/dist/commonjs/List";
import SessionChatHeader from "./SessionChatHeader";
import SessionChatInfo, { defaultTabs } from "./SessionChatInfo";
import MessageList from "./MessageList";
import MessageSender from "./MessageSender";
import styles from "./index.less";

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  state = {
    sessionChatInfoSize: 300
  };

  componentDidMount() {
    const { session, fetchSessionMsgs } = this.props;
    fetchSessionMsgs(session);
  }

  componentDidUpdate() {
    const { session, projMsgs, fetchSessionMsgs } = this.props;
    if (!projMsgs) {
      // 防止消息被删除了
      fetchSessionMsgs(session);
    }
  }

  render() {
    const { projectDomain, projectType } = this.context;
    const {
      isMyHandling,
      dispatch,
      appData,
      session,
      project,
      projMsgs,
      tabs = defaultTabs,
      isCurrentOpened = true,
      projTxMsgIDs = [],
      txMsgs = {}
    } = this.props;
    const { staffs, customers, domains, app } = appData;
    const { access_functions } = app;
    return (
      <div className={styles.splitter}>
        <div className={styles.splitHeader}>
          <SessionChatHeader
            isMyHandling={isMyHandling}
            dispatch={dispatch}
            projectDomain={projectDomain}
            projectType={projectType}
            domains={domains}
            access_functions={access_functions}
            project={project}
            customers={customers}
            session={session}
          />
        </div>
        <div className={styles.splitContent}>
          <SplitPane
            className={styles.splitPane}
            primary="second"
            split="vertical"
            defaultSize={this.state.sessionChatInfoSize}
            minSize={300}
            maxSize={400}
            paneClassName={styles.main}
            onChange={size => this.setState({ sessionChatInfoSize: size })}
          >
            {this.renderMsgArea({
              isMyHandling,
              dispatch,
              session,
              staffs,
              customers,
              projMsgs,
              projTxMsgIDs,
              txMsgs,
              isCurrentOpened
            })}
            <SessionChatInfo
              tabs={tabs}
              dispatch={dispatch}
              session={session}
              project={project}
              staffs={staffs}
              customers={customers}
              size={this.state.sessionChatInfoSize}
            />
          </SplitPane>
        </div>
      </div>
    );
  }

  renderMsgArea({
    isMyHandling,
    dispatch,
    session,
    staffs,
    customers,
    projMsgs,
    projTxMsgIDs,
    txMsgs,
    isCurrentOpened
  }) {
    const { loadSessionMsgs, fetchSessionMsgs } = this.props;
    const msgList = (
      <MessageList
        ref={r => {
          this.msg_list = r;
        }}
        isMyHandling={isMyHandling}
        loadSessionMsgs={loadSessionMsgs}
        fetchSessionMsgs={fetchSessionMsgs}
        dispatch={dispatch}
        session={session}
        staffs={staffs}
        customers={customers}
        projMsgs={projMsgs || {}}
        projTxMsgIDs={projTxMsgIDs || []}
        txMsgs={txMsgs}
        isCurrentOpened={isCurrentOpened}
      />
    );
    if (isMyHandling) {
      return (
        <SplitPane
          className={styles.splitPane}
          primary="second"
          split="horizontal"
          defaultSize={120}
          minSize={100}
          maxSize={240}
          paneClassName={styles.main}
        >
          {msgList}
          <MessageSender
            dispatch={dispatch}
            session={session}
            onSend={() => this.msg_list._updateIsInReadState(false)}
          />
        </SplitPane>
      );
    }
    const { senderArea } = this.props;
    return (
      <div className={styles.splitter}>
        <div className={styles.main}>{msgList}</div>
        <div className={styles.senderArea}>{senderArea}</div>
      </div>
    );
  }
}
