import React, { Fragment } from "react";
import { Tabs, Icon } from "antd";
import CompactCard from "~/components/CompactCard";
import LabelList from "~/components/LabelList";
import styles from "./ProjectInfo.less";

export default class extends React.Component {
  state = {
    loadingProjectInfo: false
  };

  render() {
    const labelValues = [
      {
        label: "所属用户xxxxxxxxxxxxxxxxxxxxxxxx",
        value: "用户名字"
      },
      {
        label: "所属客服组长长长长长长",
        value: "这是一个用户组更长的啦啦啦更长更长"
      },
      {
        label: "所属用户",
        value: "用户名字"
      }
    ];
    return (
      <Fragment>
        <CompactCard title="项目信息" bordered={false} extra={this.renderProjectInfoExtra()}>
          <LabelList items={labelValues} labelStyle={{ color: "gray" }} valueStyle={{ color: "black" }} />
        </CompactCard>
        <CompactCard loading title="参与用户" bordered={false}>
          这里是参与用户
        </CompactCard>
        <CompactCard title="相关客服" bordered={false}>
          这里是相关客服
        </CompactCard>
      </Fragment>
    );
  }

  renderProjectInfoExtra() {
    const { loadingProjectInfo } = this.state;
    return <Icon spin={loadingProjectInfo} type="sync" className={styles.projectInfoExtra} />;
  }
}
