import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.less';


class View extends Component {
  state = {
    activeKey: undefined
  };

  onChange = (activeKey) => {
    this.setState({activeKey});
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
  };

  remove = (targetKey) => {
  };

  componentDidMount() {
  }

  render() {
    const { myHandling } = this.props;
    const { opened_sessions } = myHandling;
    if (opened_sessions.length === 0) {
      return (
        <p>请选择会话接待</p>
      );
    }

    return (
      <Tabs
        hideAdd
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {opened_sessions.map(s => {
          <Tabs.Pane key={s.id} tag={s.owner}>
            {s.updated}
          </Tabs.Pane>
        })}
      </Tabs>
    );
  }
}


function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps)(View);
