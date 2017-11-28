import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import * as projectNotify from "../../../services/projectNotify";
import SplitPane from "react-split-pane";
import List from "react-virtualized/dist/commonjs/List";
import SessionChatHeader from "./SessionChatHeader";
import SessionChatInfo from "./SessionChatInfo";
import MessageList from "./MessageList";
import MessageSender from "./MessageSender";
import styles from "./SessionChatDetail.less";

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  componentDidMount() {
    const { session } = this.props;
    projectNotify.fetchProjectMsgs(this.context, this.props, session.project_id);
  }
  componentDidUpdate(prevProps, prevState) {
    // const { session } = this.props;
    // // FIXME: 完善未读数的更新
    // dispatchDomainTypeEffect(this.context, this.props, "_/syncSessionMsgID", {
    //   projectID: session.project_id,
    //   sessionID: session.id
    // });
  }
  componentWillUnmount() {
  }

  render() {
    const { projectDomain, projectType } = this.context;
    const { dispatch, appData, session, project, projMsgs } = this.props;
    const { staffs, customers, domains } = appData;
    return (
      <div className={styles.splitter}>
        <div className={styles.splitHeader}>
          <SessionChatHeader
            projectDomain={projectDomain}
            projectType={projectType}
            domains={domains}
            project={project}
            customers={customers}
          />
        </div>
        <div className={styles.splitContent}>
          <SplitPane
            className={styles.splitPane}
            primary="second"
            split="vertical"
            defaultSize={320}
            minSize={320}
            maxSize={360}
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
              <MessageSender dispatch={dispatch} session={session} />
            </SplitPane>
            <SessionChatInfo />
          </SplitPane>
        </div>
      </div>
    );
  }
}
