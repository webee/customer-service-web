import React, { Fragment } from "react";
import { Tabs, Icon, Tag, Button } from "antd";
import CompactCard from "~/components/CompactCard";
import LabelList from "~/components/LabelList";
import styles from "./ProjectInfo.less";
import { accessFunction } from "../accessFunctions";

export default class extends React.Component {
  state = {
    loadingProjectInfo: false,
    accessCustomerDetailsLoading: {}
  };

  renderValue = value => {
    switch (typeof value) {
      case "string":
        return value;
      case "boolean":
        return <Icon type={value ? "check-circle" : "close-circle"} />;
      default:
        return JSON.stringify(value);
    }
  };

  renderDataItem = (type, value) => {
    switch (type) {
      case "value":
        return this.renderValue(value);
      case "link":
        return (
          <a href={value.href} target="_blank">
            {value.value}
          </a>
        );
    }
  };

  getBizInfoLabelValues() {
    const { project } = this.props;
    const { meta_data, ext_data } = project;
    const data = [
      ...meta_data,
      ...ext_data,
      ["好长的名字名字名字名字", "value", "这个更长啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"]
    ];
    return data.map(d => ({ label: d[0], value: this.renderDataItem(d[1], d[2]) }));
  }

  getStaffsLabelValues() {
    const { session, project, staffs } = this.props;
    return [
      { label: "接待人", value: staffs[session.handler].name },
      { label: "负责人", value: staffs[project.leader].name }
    ];
  }

  render() {
    const { session, project, staffs, customers } = this.props;
    const { tags } = project;
    return (
      <Fragment>
        <CompactCard title="业务信息" bordered={false} extra={this.renderBizInfoExtra()}>
          <LabelList
            items={this.getBizInfoLabelValues()}
            labelStyle={{ color: "gray" }}
            valueStyle={{ color: "black" }}
          />
        </CompactCard>
        {tags.length > 0 && (
          <CompactCard title="标签" bordered={false}>
            {project.tags.map((tag, i) => (
              <Tag key={i} color="#2db7f5" style={{ fontSize: 14, margin: 4 }}>
                {tag}
              </Tag>
            ))}
          </CompactCard>
        )}
        <CompactCard title="参与用户" bordered={false}>
          {project.customers.map(this.renderCustomerDetailsButton)}
        </CompactCard>
        <CompactCard title="相关客服" bordered={false}>
          <LabelList
            items={this.getStaffsLabelValues()}
            labelStyle={{ color: "gray" }}
            valueStyle={{ color: "black" }}
          />
        </CompactCard>
      </Fragment>
    );
  }

  accessCustomerDetails = (project_id, uid) => {
    this.setState(
      s => ({ accessCustomerDetailsLoading: { ...s.accessCustomerDetailsLoading, [uid]: true } }),
      async () => {
        try {
          accessFunction(project_id, "customerDetails", uid);
        } catch (err) {
          console.error(err);
          message.error(`访问用户详情失败`);
        } finally {
          this.setState(s => ({ accessCustomerDetailsLoading: { ...s.accessCustomerDetailsLoading, [uid]: false } }));
        }
      }
    );
  };

  renderBizInfoExtra() {
    const { loadingProjectInfo } = this.state;
    return <Icon spin={loadingProjectInfo} type="sync" className={styles.projectInfoExtra} />;
  }

  renderCustomerDetailsButton = (uid, i) => {
    const { project, customers } = this.props;
    const c = customers[uid];
    const loading = this.state.accessCustomerDetailsLoading[c.uid];
    return (
      <Button
        key={i}
        ghost
        type="primary"
        style={{ fontSize: 14, margin: 4 }}
        loading={loading}
        onClick={e => this.accessCustomerDetails(project.id, c.uid)}
      >
        {c.name || c.mobile}
      </Button>
    );
  };
}
