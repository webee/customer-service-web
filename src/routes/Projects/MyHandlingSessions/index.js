import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainTypeEffect } from "../../../services/project";
import { List, Avatar, Badge, Tag } from "antd";
import SplitPane from "react-split-pane";
import styles from "./index.less";

import SessionList from "./SessionList";
import SessionDetails from "./SessionDetails";

@connect()
export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  componentDidMount() {
    dispatchDomainTypeEffect(this.context, this.props, "myHandling/fetchSessions");
    this.fetchSessionsInterval = setInterval(
      () => dispatchDomainTypeEffect(this.context, this.props, "myHandling/fetchSessions"),
      6000
    );
  }

  componentWillUnmount() {
    clearInterval(this.fetchSessionsInterval);
  }

  render() {
    const { data } = this.props;
    return (
      <SplitPane
        className={styles.splitPane}
        split="vertical"
        defaultSize={250}
        minSize={250}
        maxSize={300}
        paneClassName={styles.main}
      >
        <SessionList data={data} />
        <SessionDetails data={data} />
      </SplitPane>
    );
  }
}
