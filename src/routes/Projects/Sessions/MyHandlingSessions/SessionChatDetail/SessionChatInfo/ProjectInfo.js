import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Tabs, Icon, Tag, Button, Badge } from "antd";
import { dispatchDomainTypeEffect } from "~/services/project";
import CompactCard from "~/components/CompactCard";
import LabelList from "~/components/LabelList";
import styles from "./ProjectInfo.less";
import { accessFunction } from "../accessFunctions";
import { renderTs, renderStaff, renderBoolean, TagsRenderer } from "../../../commons";

const labelListDefaultStyle = {
  labelStyle: { color: "gray" },
  valueStyle: { color: "black" }
};

export default class extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  state = {
    loadingProjectInfo: false,
    accessCustomerDetailsLoading: {}
  };

  renderValue = value => {
    switch (typeof value) {
      case "string":
        return value;
      case "boolean":
        return renderBoolean(value);
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
    const data = [...meta_data, ...ext_data];
    return data.map(d => ({ label: d[0], value: this.renderDataItem(d[1], d[2]) }));
  }

  getStaffsLabelValues() {
    const { session, project, staffs } = this.props;
    return [
      { label: "接待人", value: renderStaff(staffs[session.handler]) },
      { label: "负责人", value: renderStaff(staffs[project.leader]) }
    ];
  }

  getSessionLabelValues() {
    const { session, project } = this.props;
    return [
      { label: "项目id", value: project.id },
      { label: "会话id", value: session.id },
      { label: "开始时间", value: renderTs(session.created, "", "YYYY-MM-DD HH:mm:ss") },
      session.closed ? { label: "结束时间", value: renderTs(session.closed, "", "YYYY-MM-DD HH:mm:ss") } : undefined
    ];
  }

  render() {
    const { session, project, staffs, customers, size } = this.props;
    const { tags } = project;
    return (
      <Fragment>
        <CompactCard title="业务信息" bordered={false} extra={this.renderBizInfoExtra()}>
          <LabelList items={this.getBizInfoLabelValues()} {...labelListDefaultStyle} />
        </CompactCard>
        {tags.length > 0 && (
          <CompactCard title="标签" bordered={false}>
            <TagsRenderer
              tags={project.tags}
              maxWidth={size - 60}
              onUpdate={() => measure}
              style={{ fontSize: 14, margin: 4 }}
            />
          </CompactCard>
        )}
        <CompactCard title="参与用户" bordered={false}>
          {/*显示出用户和相关客服的在线状态*/}
          {project.customers.map(this.renderCustomerDetailsButton)}
        </CompactCard>
        <CompactCard title="相关客服" bordered={false}>
          <LabelList items={this.getStaffsLabelValues()} {...labelListDefaultStyle} />
        </CompactCard>
        <CompactCard title="会话信息" bordered={false}>
          <LabelList items={this.getSessionLabelValues()} {...labelListDefaultStyle} />
        </CompactCard>
      </Fragment>
    );
  }

  componentDidMount() {
    this.fetchProjectExtData();
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
    return (
      <Icon
        spin={loadingProjectInfo}
        type="sync"
        className={styles.projectInfoExtra}
        onClick={loadingProjectInfo ? undefined : this.fetchProjectExtData}
      />
    );
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

  fetchProjectExtData = async () => {
    const { project } = this.props;
    try {
      this.setState({ loadingProjectInfo: true });
      await dispatchDomainTypeEffect(this.context, this.props, "_/fetchProjectExtData", project.id);
    } finally {
      this.setState({ loadingProjectInfo: false });
    }
  };
}
