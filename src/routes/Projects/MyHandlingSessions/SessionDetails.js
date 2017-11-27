import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Tabs } from "antd";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import SessionChatDetail from "./SessionChatDetail";
import EmptyContent from "./EmptyContent";
import styles from "./SessionDetails.less";

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  onChange = activeKey => {
    dispatchDomainType(this.context, this.props, "myHandling/activateOpenedSession", parseInt(activeKey));
  };

  // edit actions
  add = targetKey => {};

  remove = targetKey => {
    const sessionID = parseInt(targetKey);
    dispatchDomainType(this.context, this.props, "myHandling/closeOpenedSession", sessionID);
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  renderSessionChatDetail(id) {
    const { dispatch, data, myHandlingData } = this.props;
    const { sessions } = data;
    const { projectMsgs } = data;
    const session = sessions[id];
    const projMsgs = projectMsgs[session.project_id] || {};
    return <SessionChatDetail dispatch={dispatch} session={session} projMsgs={projMsgs} />;
  }

  render() {
    const { dispatch, data, myHandlingData } = this.props;
    const { sessions, openedSessions, currentOpenedSession } = myHandlingData;
    const { projectMsgs } = data;
    if (openedSessions.length === 0) {
      return <EmptyContent fontSize={96} />;
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
              {this.renderSessionChatDetail(id)}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  }
}
