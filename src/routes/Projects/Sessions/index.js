import React, { Component } from "react";
import { routerRedux } from "dva/router";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Tabs, Button, Icon } from "antd";
import styles from "./index.less";

import TopRightButton from "~/components/TopRightButton";
import MyHandlingSessionsView from "./MyHandlingSessions";
import HandlingSessionsView from "./HandlingSessions";
import HandledSessionsView from "./HandledSessions";

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
    console.debug(`mount: ${projectDomain}/${projectType}`);
  }

  componentWillUnmount() {
    const { projectDomain, projectType } = this.props;
    console.debug(`unmount: ${projectDomain}/${projectType}`);
  }

  onTabChange = tab => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `./${tab}` }));
  };

  onToggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  getTabContent(key, activeKey) {
    if (activeKey === key) {
      // FIXME: 导致切换tab重新渲染
      return (
        <TabContentView expanded={this.state.expanded} onToggleExpand={this.onToggleExpand}>
          <PureTabContentView name={key} {...this.props} />
        </TabContentView>
      );
    }
  }

  render() {
    const { expanded } = this.state;
    const { match } = this.props;
    const { tab } = match.params;
    return expanded ? (
      this.getTabContent(tab, tab)
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
          {this.getTabContent("my_handling", tab)}
        </Tabs.TabPane>
        <Tabs.TabPane tab="正在接待" key="handling">
          {this.getTabContent("handling", tab)}
        </Tabs.TabPane>
        <Tabs.TabPane tab="完成接待" key="handled">
          {this.getTabContent("handled", tab)}
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
      return <HandlingSessionsView dispatch={dispatch} appData={appData} data={data._} handlingData={data.handling} />;
    case "handled":
      return <HandledSessionsView dispatch={dispatch} appData={appData} data={data._} handledData={data.handled} />;
  }
};

const TabContentView = ({ expanded, onToggleExpand, children }) => {
  const icon = expanded ? "shrink" : "arrows-alt";
  return (
    <TopRightButton icon={icon} style={{ backgroundColor: "white" }} onClick={onToggleExpand}>
      {children}
    </TopRightButton>
  );
};
