import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.less';

import MyHandlingSessionsView from './MyHandlingSessions';


class View extends Component {
  componentDidMount() {
    console.log('projects did mount');
  }

  onTabChange = (key) => {
    const { dispatch } = this.props;
    console.log(`tab ${key} selected`);
  };

  render() {
    const {match} = this.props;
    const {params} = match;
    return (
      <Tabs onChange={this.onTabChange} size="default"
            defaultActiveKey="my_in_handling_sessions"
            animated={false}
      >
        <Tabs.TabPane tab="我接待中的会话" key="my_in_handling_sessions">
          <MyHandlingSessionsView />
				</Tabs.TabPane>
        <Tabs.TabPane tab="接待中的会话" key="in_handling_sessions">
          接待中的会话
        </Tabs.TabPane>
        <Tabs.TabPane tab="最近接待的会话" key="handled_sessions">
          最近接待的会话
        </Tabs.TabPane>
			</Tabs>
    );
  }
}



function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(View);
