import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withRouter } from "dva/router";
import { connect } from "dva";
import { parseQueryFromSearch } from "~/utils/url";
import * as projectWorkers from "../../../services/projectWorkers";
import { List, Avatar, Badge, Tag } from "antd";
import SplitPane from "react-split-pane";
import styles from "./index.less";

import SessionList from "./SessionList";
import SessionDetails from "./SessionDetails";

// TODO: 全局语音portal挂载点
// const etcRoot = document.getElementById("etc-root");

@withRouter
export default class View extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };
  constructor(props) {
    super(props);
    // this.audio = undefined;
  }

  componentDidMount() {
    const { location } = this.props;
    const query = parseQueryFromSearch(location.search);
    const session_id = parseInt(query.session_id) || undefined;
    projectWorkers.fetchMyHandlingSessions(this.context, this.props, { session_id });
  }

  render() {
    const { dispatch, appData, data, myHandlingData } = this.props;
    return (
      // <div>
      <SplitPane
        className={styles.splitPane}
        split="vertical"
        defaultSize={280}
        minSize={280}
        maxSize={320}
        paneClassName={styles.main}
      >
        <SessionList dispatch={dispatch} appData={appData} data={data} myHandlingData={myHandlingData} />
        <SessionDetails dispatch={dispatch} appData={appData} data={data} myHandlingData={myHandlingData} />
      </SplitPane>
      // TODO: 全局语音播放，同时只能放一个语音
      // {ReactDOM.createPortal(
      //   <audio ref={ref => (this.audio = ref)} />,
      //   etcRoot
      // )}
      // </div>
    );
  }
}
