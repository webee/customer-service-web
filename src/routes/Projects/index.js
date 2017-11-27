import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Tabs, Button, Icon } from "antd";
import styles from "./index.less";

import TopRightButton from "../../components/TopRightButton";
import MyHandlingSessionsView from "./MyHandlingSessions";

@connect((state, ownProps) => {
  const { projectDomain, projectType } = ownProps;
  const data = state.project[[projectDomain, projectType]];
  const appData = state.app;
  return { data, appData };
})
export default class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeKey: "my_handling_sessions",
      expanded: false
    };
  }

  static childContextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  getChildContext() {
    const { projectDomain, projectType } = this.props;
    return { projectDomain, projectType };
  }

  onTabChange = activeKey => {
    this.setState({ activeKey });
  };

  onToggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  getPureTabContent(key) {
    const { dispatch } = this.props;
    const { projectDomain, projectType, data, appData } = this.props;
    switch (key) {
      case "my_handling_sessions":
        return <MyHandlingSessionsView dispatch={dispatch} appData={appData} data={data._} myHandlingData={data.myHandling} />;
      case "other_handling_sessions":
        return (
          <h1>
            {projectDomain}/{projectType}: 接待中的会话
          </h1>
        );
      case "handled_sessions":
        return (
          <div style={{ flex: "1 0 auto" }}>
            <h1>
              {projectDomain}/{projectType}:
              最近接待的会话叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
              最近接待的会话<br/>
            </h1>
          </div>
        );
    }
  }

  getTabContent(key) {
    const { expanded } = this.state;
    const icon = expanded ? "shrink" : "arrows-alt";
    return (
      <TopRightButton
        icon={icon}
        style={{ flex: "auto" }}
        contentStyle={{ height: "100%", display: "flex" }}
        onClick={this.onToggleExpand}
      >
        {this.getPureTabContent(key)}
      </TopRightButton>
    );
  }

  render() {
    const { activeKey, expanded } = this.state;
    return expanded ? (
      this.getTabContent(activeKey)
    ) : (
      <Tabs
        className={styles.main}
        onChange={this.onTabChange}
        size="default"
        activeKey={activeKey}
        defaultActiveKey="my_handling_sessions"
        animated={false}
      >
        <Tabs.TabPane tab="我接待中的会话" key="my_handling_sessions">
          {this.getTabContent("my_handling_sessions")}
        </Tabs.TabPane>
        <Tabs.TabPane tab="接待中的会话" key="other_handling_sessions">
          {this.getTabContent("other_handling_sessions")}
        </Tabs.TabPane>
        <Tabs.TabPane tab="最近接待的会话" key="handled_sessions">
          {this.getTabContent("handled_sessions")}
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
