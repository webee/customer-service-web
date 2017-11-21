import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { List, Avatar, Badge, Tag } from "antd";
import SplitPane from "react-split-pane";
import styles from "./index.less";

import SessionList from "./SessionList";
import SessionDetails from "./SessionDetails";

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  render() {
    const { projectDomain, projectType } = this.context;
    return (
      <SplitPane
        className={styles.splitPane}
        split="vertical"
        defaultSize={250}
        minSize={250}
        maxSize={300}
        paneClassName={styles.main}
      >
        <SessionList />
        <SessionDetails />
      </SplitPane>
    );
  }
}
