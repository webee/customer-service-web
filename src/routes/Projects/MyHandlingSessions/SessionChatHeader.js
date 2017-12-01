import React from "react";
import { dispatchDomainTypeEffect } from "../../../services/project";
import { Button, Icon, message } from "antd";
import styles from "./SessionChatHeader.less";

export default class extends React.PureComponent {
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

  render() {
    const { projectDomain, projectType, domains, project } = this.props;
    const domain = domains[projectDomain];
    const type = domain.types[projectType];
    const { owner } = project;
    return (
      <div className={styles.main}>
        <div className={styles.info}>
          <h1>
            {domain.title}/{type.title}: {owner.name}({owner.uid})
          </h1>
        </div>
        <div className={styles.toobar}>
          <Icon type="tag" onClick={() => this.onToolbarClick("tag")} />
          <Icon type="calendar" onClick={() => this.onToolbarClick("calendar")} />
          <Icon type="check-circle" onClick={() => this.onToolbarClick("check")} />
          <Button
            type="primary"
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
}
