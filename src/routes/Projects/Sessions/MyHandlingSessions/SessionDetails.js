import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import * as projectWorkers from "~/services/projectWorkers";
import { Tabs } from "antd";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import EmptyContent from "~/components/EmptyContent";
import SessionChatDetail from "./SessionChatDetail";
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
    const { sessions, projects, projectMsgs, projectTxMsgIDs, txMsgs } = data;
    const { currentOpenedSession } = myHandlingData;
    const session = sessions[id];
    const project = projects[session.project_id];
    const projMsgs = projectMsgs[session.project_id];
    const projTxMsgIDs = projectTxMsgIDs[session.project_id];
    return (
      <SessionChatDetail
        isMyHandling={true}
        dispatch={dispatch}
        appData={appData}
        session={session}
        isCurrentOpened={currentOpenedSession === session.id}
        project={project}
        projMsgs={projMsgs}
        projTxMsgIDs={projTxMsgIDs}
        txMsgs={txMsgs}
        loadSessionMsgs={this.loadSessionMsgs}
        fetchSessionMsgs={this.fetchSessionMsgs}
      />
    );
  }

  fetchSessionMsgs = session => {
    projectWorkers.fetchProjectMsgs(this.context, this.props, session.project_id);
  };

  loadSessionMsgs = session => {
    projectWorkers.loadProjectMsgs(this.context, this.props, session.project_id);
  };

  getSessionName(id) {
    const { data, appData } = this.props;
    const { sessions, projects } = data;
    const session = sessions[id];
    const project = projects[session.project_id];
    const owner = appData.customers[project.owner];
    return owner.name || owner.mobile;
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
