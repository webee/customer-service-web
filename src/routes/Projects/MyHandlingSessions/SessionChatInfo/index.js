import React from "react";
import PropTypes from "prop-types";
import * as projectWorkers from "~/services/projectWorkers";
import { Tabs } from "antd";
import styles from "./index.less";
import ProjectInfo from "./ProjectInfo";

export default class extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  xxx = () => {
    const { session } = this.props;
    projectWorkers.loadProjectMsgs(this.context, this.props, session.project_id);
  };

  render() {
    const { session, project, staffs, customers } = this.props;
    return (
      <Tabs className={styles.main} defaultActiveKey="info" type="card">
        <Tabs.TabPane tab="信息" key="info">
          <ProjectInfo session={session} project={project} staffs={staffs} customers={customers} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="历史" key="history">
          <div onClick={this.xxx}>这里是项目历史消息</div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="回复" key="other">
          其它
        </Tabs.TabPane>
        <Tabs.TabPane tab="记录" key="xxx">
          TODO
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
