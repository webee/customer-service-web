import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import SplitPane from "react-split-pane";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import MessageList from './MessageList';
import styles from "./SessionChatDetail.less";

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  componentDidMount() {
    const { session } = this.props;
    dispatchDomainTypeEffect(this.context, this.props, "_/fetchProjectNewMsgs", {
      projectID: session.proj_id,
      limit: 100
    });
  }
  componentWillUnmount() {
    const { session } = this.props;
    dispatchDomainType(this.context, this.props, "myHandling/clearProjectMsgs", session.proj_id);
  }

  render() {
    const { projectDomain, projectType } = this.context;
    const { dispatch, session, projMsgs } = this.props;
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
              <MessageList projMsgs={projMsgs} />
              <div>消息发送区域</div>
            </SplitPane>
            <div>会话信息区域</div>
          </SplitPane>
        </div>
      </div>
    );
  }
}
