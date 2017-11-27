import React from "react";
import { Tabs } from "antd";
import styles from "./SessionChatInfo.less";

export default class extends React.Component {
  render() {
    return (
      <Tabs className={styles.main} defaultActiveKey="info" type="card">
        <Tabs.TabPane tab="信息" key="info">
          <div>
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
            这里放项目和会话信息<br />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="历史" key="history">
          这里是项目历史消息
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
