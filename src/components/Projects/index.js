import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.less';

import MyHandlingSessionsView from './MyHandlingSessions';


class View extends Component {
  state = {
  };

  componentDidMount() {
    console.log('projects did mount');
  }

  onTabChange = (key) => {
    const { dispatch } = this.props;
    console.log(`tab ${key} selected`);
  };

  render() {
    return (
      <Tabs className={styles.main}
            onChange={this.onTabChange} size="default"
            defaultActiveKey="my_handling_sessions"
            animated={false}
      >
        <Tabs.TabPane tab="我接待中的会话" key="my_handling_sessions">
          <MyHandlingSessionsView {...this.props.match.params} />
				</Tabs.TabPane>
        <Tabs.TabPane tab="接待中的会话" key="other_handling_sessions">
          接待中的会话
        </Tabs.TabPane>
        <Tabs.TabPane tab="最近接待的会话" key="handled_sessions">
          最近接待的会话
        </Tabs.TabPane>
			</Tabs>
    );
  }
}



function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps)(View);
