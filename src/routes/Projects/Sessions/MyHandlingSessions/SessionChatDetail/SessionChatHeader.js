import React from "react";
import { delay } from "~/utils/commons";
import { dispatchDomainTypeEffect } from "~/services/project";
import * as projectService from "~/services/project";
import { Menu, Dropdown, Button, Icon, message, Modal } from "antd";
import styles from "./SessionChatHeader.less";
import { genCustomerMobileName } from "../utils";
import { accessFunction } from "./accessFunctions";

const MAX_ACCESS_FUNCTIONS = 3;

export default class extends React.PureComponent {
  state = {
    accessFunctionsLoading: {},
    showCloseSession: false,
    closeSessionConfirmLoading: false
  };

  onToolbarClick = t => {
    message.info(`${t} clicked!`);
  };

  finishHandling = async () => {
    try {
      this.setState({ confirmLoading: true });
      const { session } = this.props;
      dispatchDomainTypeEffect(this.props, this.props, "myHandling/finishHandlingSession", {
        projectID: session.project_id,
        sessionID: session.id
      });
    } finally {
      // already unmounted
      // this.setState({ confirmLoading: false });
    }
  };

  accessFunction = name => {
    this.setState(
      s => ({ accessFunctionsLoading: { ...s.accessFunctionsLoading, [name]: true } }),
      async () => {
        const { project } = this.props;
        try {
          accessFunction(project.id, name);
        } catch (err) {
          console.error(err);
          message.error(`访问功能失败`);
        } finally {
          this.setState(s => ({ accessFunctionsLoading: { ...s.accessFunctionsLoading, [name]: false } }));
        }
      }
    );
  };

  render() {
    const { projectDomain, projectType, domains, access_functions, project, customers } = this.props;
    const domain = domains[projectDomain];
    const type = domain.types[projectType];
    const owner = customers[project.owner];
    return (
      <div className={styles.main}>
        <div className={styles.info}>
          <h1>
            {domain.title}/{type.title}: {genCustomerMobileName(owner)}
          </h1>
        </div>
        <div className={styles.toobar}>
          {access_functions.slice(0, MAX_ACCESS_FUNCTIONS).map(this.renderAcctionFunctionButton)}
          {this.renderMoreAccessFunctions(access_functions.slice(MAX_ACCESS_FUNCTIONS))}
          <Button type="danger" ghost onClick={() => this.setState({ showCloseSession: true })}>
            结束接待
          </Button>
          <Modal
            title="结束接待"
            visible={this.state.showCloseSession}
            confirmLoading={this.state.closeSessionConfirmLoading}
            onOk={this.finishHandling}
            onCancel={() => this.setState({ showCloseSession: false })}
          >
            <p>确定完成接待了?</p>
          </Modal>
        </div>
      </div>
    );
  }

  renderAcctionFunctionButton = af => {
    const loading = this.state.accessFunctionsLoading[af.name];
    return (
      <Button
        key={af.name}
        type="primary"
        style={{ fontSize: "16px" }}
        loading={loading}
        onClick={e => this.accessFunction(af.name)}
      >
        {af.label}
      </Button>
    );
  };

  renderMoreAccessFunctions(access_functions) {
    if (access_functions.length <= 0) {
      return;
    }

    const menu = (
      <Menu>
        {access_functions.map(af => <Menu.Item key={af.name}>{this.renderAcctionFunctionButton(af)}</Menu.Item>)}
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <Button type="primary">
          更多<Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
