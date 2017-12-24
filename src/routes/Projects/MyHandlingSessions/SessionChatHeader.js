import React from "react";
import { dispatchDomainTypeEffect } from "../../../services/project";
import * as projectService from "~/services/project";
import { delay } from "~/utils/commons";
import { Menu, Dropdown, Button, Icon, message } from "antd";
import styles from "./SessionChatHeader.less";
import { genCustomerMobileName } from "./utils";

const MAX_ACCESS_FUNCTIONS = 3;

export default class extends React.PureComponent {
  state = {
    accessFunctionsLoading: {}
  };

  onToolbarClick = t => {
    message.info(`${t} clicked!`);
  };

  finishHandling = () => {
    const { session } = this.props;
    dispatchDomainTypeEffect(this.props, this.props, "myHandling/finishHandlingSession", {
      projectID: session.project_id,
      sessionID: session.id
    });
  };

  accessFunction = name => {
    this.setState(
      s => ({ accessFunctionsLoading: { ...s.accessFunctionsLoading, [name]: true } }),
      async () => {
        const { project } = this.props;
        try {
          const { url } = await projectService.getProjectAccessFuncionURL(project.id, name);
          const a = document.createElement("a");
          window.open(url, "_blank");
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
          <Button
            type="danger"
            ghost
            onClick={() => {
              confirm("确定结束会话?") && this.finishHandling();
            }}
          >
            结束接待
          </Button>
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
        style={{ fontSize: "14pt" }}
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
