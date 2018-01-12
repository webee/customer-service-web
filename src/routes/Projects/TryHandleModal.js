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
    current_project_id: undefined,
    showTryHandleModal: false,
    isTryHandleLoading: false
  };

  render() {
    const { showTryHandleModal, isTryHandleLoading } = this.state;
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

  activate = current_project_id => {
    this.setState({ showTryHandleModal: true, current_project_id });
  };

  cancel = () => {
    this.setState({ showTryHandleModal: false, current_project_id: undefined, isTryHandleLoading: false });
  };

  tryHandle = async () => {
    const { current_project_id } = this.state;
    try {
      this.setState({ isTryHandleLoading: true });
      await dispatchDomainTypeEffect(this.context, this.props, "_/tryHandleProject", current_project_id);
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
