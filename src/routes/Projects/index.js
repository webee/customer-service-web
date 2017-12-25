import React, { Component } from "react";
import { routerRedux } from "dva/router";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Tabs, Button, Icon } from "antd";
import styles from "./index.less";

import TopRightButton from "../../components/TopRightButton";
import MyHandlingSessionsView from "./MyHandlingSessions";

@connect((state, ownProps) => {
  const { projectDomain, projectType } = ownProps;
  const data = state.project[projectDomain][projectType];
  const appData = state.app;
  return { data, appData };
})
export default class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  componentDidMount() {
    const { projectDomain, projectType } = this.props;
    console.log(`mount: ${projectDomain}/${projectType}`);
  }

  componentWillUnmount() {
    const { projectDomain, projectType } = this.props;
    console.log(`unmount: ${projectDomain}/${projectType}`);
  }

  onTabChange = tab => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({pathname: `./${tab}`}));
  };

  onToggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  getTabContent(key) {
    const { expanded } = this.state;
    return (
      <TabContentView expanded={expanded} onToggleExpand={this.onToggleExpand}>
        <PureTabContentView name={key} {...this.props} />
      </TabContentView>
    );
  }

  render() {
    const { expanded } = this.state;
    const { match } = this.props;
    const { tab } = match.params;
    return expanded ? (
      this.getTabContent(tab)
    ) : (
      <Tabs
        className={styles.main}
        onChange={this.onTabChange}
        size="default"
        activeKey={tab}
        defaultActiveKey="my_handling"
        animated={false}
      >
        <Tabs.TabPane tab="我的接待" key="my_handling">
          {this.getTabContent("my_handling")}
        </Tabs.TabPane>
        <Tabs.TabPane tab="正在接待" key="handling">
          {this.getTabContent("handling")}
        </Tabs.TabPane>
        <Tabs.TabPane tab="最近接待" key="handled">
          {this.getTabContent("handled")}
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

const PureTabContentView = props => {
  const { dispatch, name } = props;
  const { projectDomain, projectType, data, appData } = props;
  switch (name) {
    case "my_handling":
      return (
        <MyHandlingSessionsView dispatch={dispatch} appData={appData} data={data._} myHandlingData={data.myHandling} />
      );
    case "handling":
      return (
        <h1>
          {projectDomain}/{projectType}: 接待中的会话
        </h1>
      );
    case "handled":
      return (
        <div style={{ flex: "1 0 auto" }}>
          <h1>
            {projectDomain}/{projectType}:
            最近接待的会话叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉叉<br
            />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
            最近接待的会话<br />
          </h1>
        </div>
      );
  }
};

const TabContentView = ({ expanded, onToggleExpand, children }) => {
  const icon = expanded ? "shrink" : "arrows-alt";
  return (
    <TopRightButton
      icon={icon}
      style={{ flex: "auto" }}
      contentStyle={{ height: "100%", display: "flex" }}
      onClick={onToggleExpand}
    >
      {children}
    </TopRightButton>
  );
};
