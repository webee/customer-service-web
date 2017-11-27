import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import SplitPane from "react-split-pane";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import MessageList from './MessageList';
import MessageSender from './MessageSender';
import styles from "./SessionChatDetail.less";

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  componentDidMount() {
    const { session } = this.props;
    dispatchDomainTypeEffect(this.context, this.props, "_/fetchProjectNewMsgs", {
      projectID: session.project_id,
      limit: 100
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const { session } = this.props;
    // FIXME: 完善未读数的更新
    dispatchDomainTypeEffect(this.context, this.props, "_/syncSessionMsgID", {
      projectID: session.project_id,
      sessionID: session.id,
    });
  }
  componentWillUnmount() {
    const { session } = this.props;
    dispatchDomainType(this.context, this.props, "_/clearProjectMsgs", session.project_id);
  }

  render() {
    const { projectDomain, projectType } = this.context;
    const { dispatch, appData, session, projMsgs } = this.props;
    const { staffs, customers } = appData;
    return (
      <div className={styles.splitter}>
        <div className={styles.splitHeader}>Header#{session.id}</div>
        <div className={styles.splitContent}>
          <SplitPane
            className={styles.splitPane}
            primary="second"
            split="vertical"
            defaultSize={280}
            minSize={280}
            maxSize={320}
            paneClassName={styles.main}
          >
            <SplitPane
              className={styles.splitPane}
              primary="second"
              split="horizontal"
              defaultSize={150}
              minSize={100}
              maxSize={300}
              paneClassName={styles.main}
            >
              <MessageList dispatch={dispatch} staffs={staffs} customers={customers} projMsgs={projMsgs} />
              <MessageSender dispatch={dispatch} session={session}/>
            </SplitPane>
            <div>会话信息区域</div>
          </SplitPane>
        </div>
      </div>
    );
  }
}
