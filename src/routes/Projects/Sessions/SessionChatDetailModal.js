import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, notification } from "antd";
import { dispatchDomainTypeEffect } from "~/services/project";
import SessionChatDetail from "./MyHandlingSessions/SessionChatDetail";
import TryHandleModal from "./TryHandleModal";
import styles from "./SessionChatDetailModal.less";

export default class extends React.PureComponent {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };
  state = {
    tryHandleProjectID: undefined
  };

  updateTryHandleProjectID = projectID => {
    this.setState({ tryHandleProjectID: projectID });
  };

  renderSessionChatDetail() {
    const { dispatch, appData, session, project, projMsgs } = this.props;
    const senderArea = (
      <div>
        <Button ghost type="danger" size="large" onClick={() => this.updateTryHandleProjectID(project.id)}>
          接待会话
        </Button>
        <TryHandleModal
          dispatch={dispatch}
          projectID={this.state.tryHandleProjectID}
          onCancel={this.updateTryHandleProjectID}
        />
      </div>
    );
    return (
      <SessionChatDetail
        tabs={{ default: "info", info: true }}
        dispatch={dispatch}
        appData={appData}
        session={session}
        project={project}
        projMsgs={projMsgs}
        senderArea={senderArea}
      />
    );
  }

  render() {
    return (
      <Modal
        visible={true}
        wrapClassName={styles.wrap}
        style={{ top: "8vh" }}
        width="75vw"
        footer={null}
        onCancel={this.cancel}
      >
        {this.renderSessionChatDetail()}
      </Modal>
    );
  }

  cancel = () => {
    this.props.onCancel();
  };
}
