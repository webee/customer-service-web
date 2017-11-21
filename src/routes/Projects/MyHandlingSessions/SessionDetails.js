import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Tabs } from "antd";
import {
  dispatchDomainType,
  dispatchDomainTypeEffect
} from "~/services/project";
import SessionChatDetail from "./SessionChatDetail";
import styles from "./SessionDetails.less";

@connect()
export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  onChange = activeKey => {
    dispatchDomainType(
      this.context,
      this.props,
      "myHandling/activateOpenedSession",
      parseInt(activeKey)
    );
  };

  // edit actions
  add = targetKey => {};

  remove = targetKey => {
    dispatchDomainType(
      this.context,
      this.props,
      "myHandling/closeOpenedSession",
      parseInt(targetKey)
    );
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  render() {
    const {
      sessions,
      opened_sessions: openedSessions,
      current_opened_session: currentOpenedSession
    } = this.props.data;
    if (openedSessions.length === 0) {
      return <p>请选择会话进行接待</p>;
    }

    return (
      <Tabs
        className={styles.main}
        hideAdd
        onChange={this.onChange}
        activeKey={`${currentOpenedSession}`}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {openedSessions.map(id => {
          return (
            <Tabs.TabPane key={id} tab={`会话#${id}`}>
              <SessionChatDetail session={sessions[id]} />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  }
}
