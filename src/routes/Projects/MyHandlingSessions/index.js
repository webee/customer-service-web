import React from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainTypeEffect } from "../../../services/project";
import { List, Avatar, Badge, Tag } from "antd";
import SplitPane from "react-split-pane";
import styles from "./index.less";

import SessionList from "./SessionList";
import SessionDetails from "./SessionDetails";

export default class View extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  componentDidMount() {
    dispatchDomainTypeEffect(this.context, this.props, "myHandling/fetchSessions");
    // this.fetchSessionsInterval = setInterval(
    //   () => dispatchDomainTypeEffect(this.context, this.props, "myHandling/fetchSessions"),
    //   6000
    // );
  }

  componentWillUnmount() {
    // clearInterval(this.fetchSessionsInterval);
  }

  render() {
    const { dispatch, appData, data, myHandlingData } = this.props;
    return (
      <SplitPane
        className={styles.splitPane}
        split="vertical"
        defaultSize={250}
        minSize={250}
        maxSize={300}
        paneClassName={styles.main}
      >
        <SessionList dispatch={dispatch} appData={appData} data={data} myHandlingData={myHandlingData} />
        <SessionDetails dispatch={dispatch} appData={appData} data={data} myHandlingData={myHandlingData}/>
      </SplitPane>
    );
  }
}
