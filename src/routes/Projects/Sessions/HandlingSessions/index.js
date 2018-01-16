import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { dispatchDomainTypeEffect, dispatchDomainType, domainTypeName } from "~/services/project";
import * as msgRendererService from "~/services/msgRenderer";
import EllipsisText from "~/components/EllipsisText";
import TryHandleModal from "../TryHandleModal";
import SessionChatDetailModal from "../SessionChatDetailModal";
import { Card, Table, Icon, Pagination, Divider, Button, Badge } from "antd";
import SearchForm from "./SearchForm";
import styles from "./index.css";
import {
  renderBoolean,
  renderNotBoolean,
  renderTsFromNow,
  renderTs,
  renderMsgTs,
  renderLastMsg,
  renderStaff,
  renderCustomer
} from "../commons";

function getSorterOrder(sorter, key) {
  return sorter.key == key ? sorter.order : false;
}

export default class extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };
  state = {
    params: {},
    SessionChatDetailSessionID: undefined,
    tryHandleProjectID: undefined
  };

  static childContextTypes = {
    _container: PropTypes.object
  };

  getChildContext() {
    const { _container } = this;
    return { _container };
  }

  componentDidMount() {
    this.fetchSessions("componentDidMount");
  }

  updateSessionChatDetailSessionID = sessionID => {
    this.setState({ SessionChatDetailSessionID: sessionID });
  };

  updateTryHandleProjectID = projectID => {
    this.setState({ tryHandleProjectID: projectID });
  };

  renderActions(item) {
    return (
      <span>
        <Button ghost type="primary" onClick={() => this.updateSessionChatDetailSessionID(item.id)}>
          查看
        </Button>
        <Divider type="vertical" />
        <Button ghost type="primary" onClick={() => this.updateTryHandleProjectID(item.project.id)}>
          接待
        </Button>
      </span>
    );
  }

  get columns() {
    const { handlingData } = this.props;
    const { filters, sorter } = handlingData;
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
        title: "用户ID",
        dataIndex: "project.owner.uid",
        key: "owner.uid",
        width: 150
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
        render: msg => renderMsgTs(msg, "-", "YYYY-MM-DD HH:mm:ss")
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
    const { handlingData } = this.props;
    const { sessions } = handlingData;
    return sessions.map((s, i) => ({ key: i, ...s }));
  }

  render() {
    const { appData, handlingData, dispatch } = this.props;
    const { staff, staffs, app } = appData;
    const staff_label_tree = app.staff_label_tree;
    const { isFetching, pagination } = handlingData;

    return (
      <div
        className={styles.main}
        ref={r => {
          this._container = r;
        }}
      >
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
        <TryHandleModal
          dispatch={dispatch}
          projectID={this.state.tryHandleProjectID}
          onCancel={this.updateTryHandleProjectID}
        />
        <SessionChatDetailModal
          dispatch={dispatch}
          sessionID={this.state.SessionChatDetailSessionID}
          onCancel={this.updateSessionChatDetailSessionID}
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
