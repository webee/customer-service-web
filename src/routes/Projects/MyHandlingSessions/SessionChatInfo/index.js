import React from "react";
import { Tabs, Card } from "antd";
import styles from "./index.less";

export default class extends React.Component {
  render() {
    return (
      <Tabs className={styles.main} defaultActiveKey="info" type="card">
        <Tabs.TabPane tab="信息" key="info">
          <Card title="项目信息" bordered={false}>
            <div>
              这里是项目信息<br />
              这里是项目信息<br />
              这里是项目信息<br />
              这里是项目信息<br />
              这里是项目信息<br />
              这里是项目信息<br />
              这里是项目信息<br />
              这里是项目信息<br />
            </div>
          </Card>
          <Card title="参与用户" bordered={false}>
            这里是参与用户
          </Card>
          <Card title="相关客服" bordered={false}>
            这里是相关客服
          </Card>
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
