import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, Button, Icon } from "antd";
import styles from "./index.less";

import TopRightButton from "../../../components/TopRightButton";
import MyHandlingSessionsView from "./MyHandlingSessions";

const projectDomain = "xxxx";
const projectType = "yyyy";

export default class View extends Component {
  static childContextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };
  getChildContext() {
    return { projectDomain, projectType };
  }

  state = {
    key: "my_handling_sessions",
    expanded: false
  };

  onTabChange = key => {
    const { dispatch } = this.props;
    this.setState({ key });
    console.debug(`tab ${key} selected`);
  };

  onToggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  getPureTabContent(key) {
    switch (key) {
      case "my_handling_sessions":
        return <MyHandlingSessionsView />;
      case "other_handling_sessions":
        return <h1>接待中的会话</h1>;
      case "handled_sessions":
        return <div style={{flex: "1 0 auto"}}>
        <h1>最近接待的会话叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉</h1>
        </div>;
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
    const { key, expanded } = this.state;
    return expanded ? (
      this.getTabContent(key)
    ) : (
      <Tabs
        className={styles.main}
        onChange={this.onTabChange}
        size="default"
        activeKey={key}
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
