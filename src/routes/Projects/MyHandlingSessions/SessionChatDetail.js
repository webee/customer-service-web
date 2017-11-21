import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import SplitPane from "react-split-pane";
import styles from "./SessionChatDetail.less";

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  render() {
    const { projectDomain, projectType } = this.context;
    const { session } = this.props;
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
            maxSize={400}
            paneClassName={styles.main}
          >
            <div>消息列表区域</div>
            <div>消息发送区域</div>
          </SplitPane>
            <div>会话信息区域</div>
          </SplitPane>
        </div>
      </div>
    );
  }
}
