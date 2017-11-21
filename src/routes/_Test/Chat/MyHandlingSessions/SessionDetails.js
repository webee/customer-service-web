import React, { Component } from "react";
import { connect } from "dva";
import { Tabs } from "antd";
import SessionChatDetail from './SessionChatDetail';
import styles from "./SessionDetails.less";

export default class View extends Component {
  state = {
    activeKey: "a",
    openedSessions: ["a", "b", "c", "d"]
  };

  onChange = activeKey => {
    this.setState({ activeKey: activeKey });
  };

  // edit actions
  add = targetKey => {};

  remove = targetKey => {
    const { openedSessions } = this.state;
    this.setState({
      openedSessions: openedSessions.filter(id => id !== targetKey)
    });
    if (targetKey === this.state.activeKey) {
      if (this.state.openedSessions.length > 0) {
        this.onChange(this.state.openedSessions[0]);
      }
    }
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  render() {
    const { openedSessions, activeKey } = this.state;
    if (openedSessions.length === 0) {
      return <p>请选择会话进行接待</p>;
    }

    return (
      <Tabs
        className={styles.main}
        hideAdd
        onChange={this.onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {openedSessions.map(id => {
          return (
            <Tabs.TabPane key={id} tab={`会话#${id}`}>
              <SessionChatDetail sessionID={id}/>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  }
}
