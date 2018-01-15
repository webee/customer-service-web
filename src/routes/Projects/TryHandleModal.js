import React from "react";
import PropTypes from "prop-types";
import { Modal, notification } from "antd";
import { dispatchDomainTypeEffect } from "../../services/project";

export default class extends React.PureComponent {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };
  state = {
    isTryHandleLoading: false
  };

  render() {
    const { isTryHandleLoading } = this.state;
    const {projectID} = this.props;
    const showTryHandleModal = !!projectID;
    return (
      <Modal
        title="接待"
        visible={showTryHandleModal}
        closable={!isTryHandleLoading}
        maskClosable={!isTryHandleLoading}
        onCancel={isTryHandleLoading ? undefined : this.cancel}
        onOk={this.tryHandle}
        confirmLoading={isTryHandleLoading}
      >
        <p>确定接待?</p>
      </Modal>
    );
  }

  cancel = () => {
    this.props.onCancel();
    this.setState({ isTryHandleLoading: false });
  };

  tryHandle = async () => {
    const { projectID } = this.projectID;
    try {
      this.setState({ isTryHandleLoading: true });
      await dispatchDomainTypeEffect(this.context, this.props, "_/tryHandleProject", projectID);
    } catch (e) {
      notification.error({
        placement: "bottomRight",
        message: "尝试接待未成功",
        description: "可能是权限不够，请稍后尝试"
      });
      this.cancel();
    }
  };
}
