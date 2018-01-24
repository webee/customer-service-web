import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { dispatchDomainTypeEffect, dispatchDomainType, domainTypeName } from "~/services/project";
import * as msgRendererService from "~/services/msgRenderer";
import { normalizeProject, normalizeSession } from "~/models/project/commons";
import { Card, Table, Icon, Pagination, Divider, Button, Badge } from "antd";
import TryHandleModal from "../TryHandleModal";
import SessionChatDetailModal from "../SessionChatDetailModal";
import SearchForm from "./SearchForm";
import styles from "./index.css";
import {
  renderBoolean,
  renderNotBoolean,
  renderTsFromNow,
  renderTs,
  renderStaff,
  renderCustomer,
  TagsRenderer
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
    sessionChatDetailSession: undefined,
    sessionChatDetailProjMsgsManager: undefined,
    tryHandleProjectID: undefined
  };

  static childContextTypes = {
    _container: PropTypes.object
  };

  getChildContext() {
    const { _container } = this;
    return { _container };
  }

  updateTryHandleProjectID = projectID => {
    this.setState({ tryHandleProjectID: projectID });
  };

  renderActions(item) {
    return (
      <span>
        <Button ghost type="primary" onClick={() => this.updateSessionChatDetailSession(item)}>
          查看
        </Button>
        <Divider type="vertical" />
        <Button ghost type="danger" onClick={() => this.updateTryHandleProjectID(item.project.id)}>
          接待
        </Button>
      </span>
    );
  }

  updateSessionChatDetailSession = session => {
    dispatchDomainTypeEffect(this.context, this.props, "handled/updateSessionList", [session]);
    this.setState({ sessionChatDetailSession: session });
  };
  cancelSessionChatDetailModal = () => {
    this.setState({ sessionChatDetailSession: undefined, sessionChatDetailProjMsgsManager: undefined });
  };

  loadSessionMsgs = session => {
    // 使用原始session对象调用
    dispatchDomainTypeEffect(this.context, this.props, "handled/loadSessionHistoryMsgs", { session: session._s });
  };

  renderSessionChatDetailModal() {
    const { sessionChatDetailSession: s } = this.state;
    if (!!s) {
      const { dispatch, appData, handledData } = this.props;
      const { sessions, projects, sessionMsgs } = handledData;
      const session = sessions[s.id];
      // 设置原始session对象
      session._s = s;
      const project = projects[session.project_id];
      const projMsgs = sessionMsgs[s.id];
      return (
        <SessionChatDetailModal
          onCancel={this.cancelSessionChatDetailModal}
          dispatch={dispatch}
          appData={appData}
          session={session}
          project={project}
          projMsgs={projMsgs}
          loadSessionMsgs={this.loadSessionMsgs}
          fetchSessionMsgs={this.loadSessionMsgs}
        />
      );
    }
  }

  componentWillUnmount() {
    dispatchDomainType(this.context, this.props, "handled/clearSessionMsgsData");
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
        title: "起始id",
        dataIndex: "start_msg_id",
        sorter: true,
        width: 120,
        sortOrder: getSorterOrder(sorter, "start_msg_id")
      },
      {
        title: "全部",
        dataIndex: "msg_count",
        sorter: true,
        width: 110,
        sortOrder: getSorterOrder(sorter, "msg_count")
      },
      {
        title: "项目Tags",
        dataIndex: "project.tags",
        render: tags => <TagsRenderer tags={tags} maxWidth={200} />
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
    const { items } = handledData;
    return items.map((s, i) => ({ key: i, ...s }));
  }

  render() {
    const { appData, handledData, dispatch } = this.props;
    const { staff, staffs, app } = appData;
    const staff_label_tree = app.staff_label_tree;
    const { isFetching, pagination } = handledData;

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
          scroll={{ x: 2000 }}
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
        {this.renderSessionChatDetailModal()}
      </div>
    );
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatchDomainType(this.context, this.props, "handled/resetCurrentPage");
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
