import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.less';
import {dispatchDomainType, dispatchDomainTypeEffect} from '~/services/project';


class View extends Component {
  state = {
  };

  onChange = (activeKey) => {
    dispatchDomainType(this.props, 'myHandling/activateOpenedSession', parseInt(activeKey));
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = (targetKey) => {
  };

  remove = (targetKey) => {
    dispatchDomainType(this.props, 'myHandling/closeOpenedSession', parseInt(targetKey));
  };

  componentDidMount() {
  }

  render() {
    const { myHandling } = this.props;
    const { sessions, opened_sessions, current_opened_session } = myHandling;
    if (opened_sessions.length === 0) {
      return (
        <p>请选择会话接待</p>
      );
    }

    return (
      <Tabs
        hideAdd
        onChange={this.onChange}
        activeKey={`${current_opened_session}`}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {opened_sessions.map(id => {
          const s = sessions[id];
          return (
            <Tabs.TabPane key={`${s.id}`} tab={s.owner}>
              {s.updated}
            </Tabs.TabPane>
					);
        })}
      </Tabs>
    );
  }
}


function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps)(View);
