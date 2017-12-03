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
    const { dispatch, appData, data, myHandlingData } = this.props;
    const { sessions, projects, projectMsgs, projectTxMsgs, txMsgs } = data;
    const { currentOpenedSession } = myHandlingData;
    const session = sessions[id];
    const project = projects[session.project_id];
    const projMsgs = projectMsgs[session.project_id] || {};
    const projTxMsgs = projectTxMsgs[session.project_id] || [];
    return (
      <SessionChatDetail
        dispatch={dispatch}
        appData={appData}
        session={session}
        isCurrentOpened={currentOpenedSession === session.id}
        project={project}
        projMsgs={projMsgs}
        projTxMsgs={projTxMsgs}
        txMsgs={txMsgs}
      />
    );
  }

  getSessionName(id) {
    const { data } = this.props;
    const { sessions, projects } = data;
    const session = sessions[id];
    const project = projects[session.project_id];
    const { owner } = project;
    return owner.name;
  }

  render() {
    const { myHandlingData } = this.props;
    const { openedSessions, currentOpenedSession } = myHandlingData;
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
            <Tabs.TabPane key={id} tab={this.getSessionName(id)}>
              {this.renderSessionChatDetail(id)}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  }
}
