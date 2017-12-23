import React, { Component } from "react";
import PropTypes from "prop-types";
import Rx from "rxjs/Rx";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainType } from "~/services/project";
import * as projectWorkers from "../../../services/projectWorkers";
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
  // onSend observable
  onSendObservable = new Rx.Subject();

  componentDidMount() {
    const { session } = this.props;
    projectWorkers.fetchProjectMsgs(this.context, this.props, session.project_id);
  }

  render() {
    const { projectDomain, projectType } = this.context;
    const { dispatch, appData, session, project, projMsgs, projTxMsgIDs, txMsgs, isCurrentOpened } = this.props;
    const { staffs, customers, domains, access_functions } = appData;
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
            defaultSize={320}
            minSize={320}
            maxSize={360}
            paneClassName={styles.main}
          >
            <SplitPane
              className={styles.splitPane}
              primary="second"
              split="horizontal"
              defaultSize={120}
              minSize={100}
              maxSize={300}
              paneClassName={styles.main}
            >
              <MessageList
                dispatch={dispatch}
                session={session}
                staffs={staffs}
                customers={customers}
                projMsgs={projMsgs}
                projTxMsgIDs={projTxMsgIDs}
                txMsgs={txMsgs}
                isCurrentOpened={isCurrentOpened}
                onSendObservable={this.onSendObservable}
              />
              <MessageSender dispatch={dispatch} session={session} onSend={() => this.onSendObservable.next()} />
            </SplitPane>
            <SessionChatInfo />
          </SplitPane>
        </div>
      </div>
    );
  }
}
