import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { dispatchDomainTypeEffect, dispatchDomainType, domainTypeName } from "../../../services/project";
import * as msgRendererService from "~/services/msgRenderer";
import EllipsisText from "~/components/EllipsisText";
import { Card, Table, Icon, Pagination, Divider, Button, Badge } from "antd";
import SearchForm from "./SearchForm";
import styles from "./index.css";
import { renderBoolean, renderNotBoolean, renderTsFromNow, renderTs, renderStaff, renderCustomer } from "../commons";

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
          接待
        </Button>
      </span>
    );
  }

  get columns() {
    const { handledData } = this.props;
    const { filters, sorter } = handledData;
    return [
      {
        title: "所有者",
        dataIndex: "project.owner",
        key: "owner",
        width: 230,
        fixed: "left",
        render: renderCustomer
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
        render: ts => renderTs(ts, "", "YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "会话结束时间",
        dataIndex: "closed",
        key: "closed",
        sorter: true,
        sortOrder: getSorterOrder(sorter, "closed"),
        width: 180,
        render: ts => renderTs(ts, "", "YYYY-MM-DD HH:mm:ss")
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
    const { handledData } = this.props;
    const { sessions } = handledData;
    return sessions.map((s, i) => ({ key: i, ...s }));
  }

  render() {
    const { appData, handledData } = this.props;
    const { staff, staffs, app } = appData;
    const staff_label_tree = app.staff_label_tree;
    const { isFetching, pagination } = handledData;

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
          scroll={{ x: 1520 }}
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
    dispatchDomainType(this.context, this.props, "handled/updateTableInfos", { pagination, filters, sorter });
    this.fetchSessions("handleTableChange");
  };

  fetchSessions = source => {
    console.debug("fetchSessions: ", source);
    const { params } = this.state;
    dispatchDomainTypeEffect(this.context, this.props, "handled/fetchSessions", params);
  };
}
