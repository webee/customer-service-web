import React from "react";
import PropTypes from "prop-types";
import { Modal, notification } from "antd";
import { dispatchDomainTypeEffect } from "~/services/project";
import styles from "./SessionChatDetailModal.less";

export default class extends React.PureComponent {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };
  state = {};

  render() {
    const { isTryHandleLoading } = this.state;
    const { sessionID } = this.props;
    const showModal = !!sessionID;
    return (
      <Modal
        visible={showModal}
        wrapClassName={styles.wrap}
        style={{ top: "8vh" }}
        width="75vw"
        footer={null}
        onCancel={this.cancel}
      >
        <p>
          XXXXXXXXXXXX我我我我我中中中国国国国我我我我我中中中国国国国国我我我我我中中中国国国国国我我我我我中中中国国国国国我我我我我中中中国国国国国我我我我我中中中国国国国国我我我我我中中中国国国国国国我我我我我中中中国国我我我我我中中中国国国国国国国国:{" "}
          {sessionID}
        </p>
      </Modal>
    );
  }

  cancel = () => {
    this.props.onCancel();
  };
}
