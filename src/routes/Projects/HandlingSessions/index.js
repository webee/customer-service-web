import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { dispatchDomainTypeEffect, dispatchDomainType, domainTypeName } from "../../../services/project";
import * as msgRendererService from "~/services/msgRenderer";
import EllipsisText from "~/components/EllipsisText";
import { Card, Table, Icon, Pagination, Divider, Button, Badge } from "antd";
import SearchForm from "./SearchForm";
import styles from "./index.css";
import { renderTs, renderMsgTs, renderLastMsg } from "../commons";

const renderBoolean = val => {
  return <Icon type={val ? "check-circle" : "close-circle"} style={{ color: val ? "green" : "black" }} />;
};

const renderNotBoolean = val => renderBoolean(!val);
const renderTsFromNow = (ts, def) => (ts ? moment.unix(ts).fromNow() : def);
const renderStaff = staff => <Badge status={staff.is_online ? "success" : "default"} text={staff.name} />;
const renderCustomer = user => {
  const { name } = user;
  const text = <Badge status={user.is_online ? "success" : "default"} text={name || "-"} />;
  return <EllipsisText text={text} tipText={name} width={150} />;
};

function getSorterOrder(sorter, key) {
  return sorter.key == key ? sorter.order : false;
}

export default class extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };
  state = {
    params: {}
  };

  componentDidMount() {
    this.fetchSessions("componentDidMount");
  }

  renderActions(item) {
    return (
      <span>
        <Button ghost type="primary">
          查看
        </Button>
        <Divider type="vertical" />
        <Button ghost type="primary">
          详情
        </Button>
      </span>
    );
  }

  get columns() {
    const { handlingData } = this.props;
    const { filters, sorter } = handlingData;
    return [
      {
        title: "名字",
        dataIndex: "project.owner",
        key: "owner.name",
        width: 170,
        fixed: "left",
        render: renderCustomer
      },
      {
        title: "手机号",
        dataIndex: "project.owner",
        key: "owner.mobile",
        width: 140,
        render: owner => owner.mobile
      },
      {
        title: "在线",
        dataIndex: "project.is_online",
        key: "is_online",
        width: 100,
        filterMultiple: false,
        filters: [
          {
            text: "在线",
            value: true
          },
          {
            text: "离线",
            value: false
          }
        ],
        filteredValue: filters["is_online"],
        render: renderBoolean
      },
      {
        title: "最后在线时间",
        dataIndex: "project.last_online_ts",
        key: "last_online_ts",
        sorter: true,
        sortOrder: getSorterOrder(sorter, "last_online_ts"),
        width: 160,
        render: ts => renderTsFromNow(ts, <span style={{ color: "grey" }}>未在线过</span>)
      },
      {
        title: "接待客服",
        dataIndex: "handler",
        key: "handler",
        width: 150,
        render: renderStaff
      },
      {
        title: "最后消息",
        dataIndex: "msg",
        key: "msg",
        width: 300,
        render: msg => renderLastMsg(msg, "-")
      },
      {
        title: "最后消息时间",
        dataIndex: "msg",
        key: "msg.ts",
        sorter: true,
        sortOrder: getSorterOrder(sorter, "msg.ts"),
        width: 180,
        render: msg => renderMsgTs(msg, "-", "YYYY-MM-DD hh:mm:ss")
      },
      {
        title: "未读",
        dataIndex: "unsynced_count",
        sorter: true,
        width: 110,
        sortOrder: getSorterOrder(sorter, "unsynced_count")
      },
      {
        title: "未回",
        dataIndex: "unhandled_count",
        sorter: true,
        width: 110,
        sortOrder: getSorterOrder(sorter, "unhandled_count")
      },
      {
        title: "全部",
        dataIndex: "msg_count",
        sorter: true,
        width: 110,
        sortOrder: getSorterOrder(sorter, "msg_count")
      },
      {
        title: "负责人",
        dataIndex: "project.leader",
        key: "project.leader",
        width: 150,
        render: renderStaff
      },
      {
        title: "会话开始时间",
        dataIndex: "created",
        key: "created",
        sorter: true,
        sortOrder: getSorterOrder(sorter, "created"),
        width: 180,
        render: ts => renderTs(ts, "", "YYYY-MM-DD hh:mm:ss")
      },
      {
        title: "项目Tags",
        dataIndex: "xxx",
        width: 100,
        render: v => "#TODO"
      },
      {
        title: "范围标签",
        dataIndex: "yyy",
        width: 100,
        render: v => "#TODO"
      },
      {
        title: "操作",
        key: "actions",
        fixed: "right",
        width: 200,
        render: (_, item) => this.renderActions(item)
      }
    ];
  }

  get data() {
    const { handlingData } = this.props;
    const { sessions } = handlingData;
    return sessions.map((s, i) => ({ key: i, ...s }));
  }

  render() {
    const { appData, handlingData } = this.props;
    const { staff, staffs, app } = appData;
    const staff_label_tree = app.staff_label_tree;
    const { isFetching, pagination } = handlingData;

    return (
      <div className={styles.main}>
        <SearchForm
          loading={isFetching}
          onSearch={this.onSearch}
          staff={staff}
          staffs={Object.values(staffs)}
          staffLabelTree={staff_label_tree}
        />
        <Table
          loading={isFetching}
          scroll={{ x: 2200 }}
          bordered={true}
          pagination={pagination}
          columns={this.columns}
          dataSource={this.data}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }

  onSearch = params => {
    console.debug("onSearch: ", params);
    this.setState({ params }, () => this.fetchSessions("onSearch"));
  };

  handleTableChange = (pagination, filters, sorter) => {
    console.debug("handleTableChange: ", pagination, filters, sorter);
    dispatchDomainType(this.context, this.props, "handling/updateTableInfos", { pagination, filters, sorter });
    this.fetchSessions("handleTableChange");
  };

  fetchSessions = source => {
    console.debug("fetchSessions: ", source);
    const { params } = this.state;
    dispatchDomainTypeEffect(this.context, this.props, "handling/fetchSessions", params);
  };
}
