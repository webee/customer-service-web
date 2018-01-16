import React from "react";
import PropTypes from "prop-types";
import * as projectWorkers from "~/services/projectWorkers";
import { Tabs } from "antd";
import styles from "./index.less";
import ProjectInfo from "./ProjectInfo";

export const defaultTabs = { default: "info", info: true, history: true, replies: true, opLog: true };
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
    const { session, project, staffs, customers, dispatch, size, tabs } = this.props;
    return (
      <Tabs className={styles.main} defaultActiveKey={tabs.default} type="card">
        {tabs.info && (
          <Tabs.TabPane tab="信息" key="info">
            <ProjectInfo
              dispatch={dispatch}
              size={size}
              session={session}
              project={project}
              staffs={staffs}
              customers={customers}
            />
          </Tabs.TabPane>
        )}
        {tabs.history && (
          <Tabs.TabPane tab="历史" key="history">
            <div onClick={this.xxx}>这里是项目历史消息</div>
          </Tabs.TabPane>
        )}
        {tabs.replies && (
          <Tabs.TabPane tab="回复" key="replies">
            其它
          </Tabs.TabPane>
        )}
        {tabs.opLog && (
          <Tabs.TabPane tab="记录" key="opLog">
            TODO
          </Tabs.TabPane>
        )}
      </Tabs>
    );
  }
}
