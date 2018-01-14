import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainType } from "~/services/project";
import * as projectWorkers from "~/services/projectWorkers";
import SplitPane from "react-split-pane";
import List from "react-virtualized/dist/commonjs/List";
import SessionChatHeader from "./SessionChatHeader";
import SessionChatInfo from "./SessionChatInfo";
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
    const { session } = this.props;
    projectWorkers.fetchProjectMsgs(this.context, this.props, session.project_id);
  }

  render() {
    const { projectDomain, projectType } = this.context;
    const { dispatch, appData, session, project, projMsgs, projTxMsgIDs, txMsgs, isCurrentOpened } = this.props;
    const { staffs, customers, domains, app } = appData;
    const { access_functions } = app;
    return (
      <div className={styles.splitter}>
        <div className={styles.splitHeader}>
          <SessionChatHeader
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
            maxSize={350}
            paneClassName={styles.main}
            onChange={size => this.setState({ sessionChatInfoSize: size })}
          >
            <SplitPane
              className={styles.splitPane}
              primary="second"
              split="horizontal"
              defaultSize={120}
              minSize={100}
              maxSize={240}
              paneClassName={styles.main}
            >
              <MessageList
                ref={r => {
                  this.msg_list = r;
                }}
                dispatch={dispatch}
                session={session}
                staffs={staffs}
                customers={customers}
                projMsgs={projMsgs}
                projTxMsgIDs={projTxMsgIDs}
                txMsgs={txMsgs}
                isCurrentOpened={isCurrentOpened}
              />
              <MessageSender
                dispatch={dispatch}
                session={session}
                onSend={() => this.msg_list._updateIsInReadState(false)}
              />
            </SplitPane>
            <SessionChatInfo
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
}
