import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import * as msgRendererService from "~/services/msgRenderer";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer";
import List from "react-virtualized/dist/commonjs/List";
import SessionItem from "./SessionItem";
import EmptyContent from "./EmptyContent";
import { Input, Checkbox, Button, Icon, Switch, Dropdown, Menu } from "antd";
import Moment from "react-moment";
import styles from "./SessionList.less";
import { genCustomerMobileName } from "./utils";
import { anyIs } from "~/utils/func";

const Search = Input.Search;

function get_session_last_msg_ts(s, def = 0) {
  if (s.msg) {
    return s.msg.ts;
  }
  return def;
}

function get_session_unsynced_count(s) {
  if (s.msg_id === 0) {
    return 0;
  } else if (s.sync_msg_id === 0) {
    return s.msg_id - s.start_msg_id;
  }
  return s.msg_id - s.sync_msg_id;
}

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.cache = new CellMeasurerCache({
      defaultHeight: 60,
      fixedWidth: true,
      keyMapper: (rowIndex, columnIndex) => {
        const sessionList = this.getSessionList();
        const session = sessionList[rowIndex];
        return session.id;
      }
    });
  }

  onSearchChange = e => {
    dispatchDomainType(this.context, this.props, "myHandling/changeListSearch", e.target.value);
  };

  onSearch = q => {
    dispatchDomainType(this.context, this.props, "myHandling/changeListSearch", q);
  };

  onFilterChange = (filter, checked) => {
    dispatchDomainType(this.context, this.props, "myHandling/updateListFilters", { [filter]: checked });
  };

  getFilterSwitchOnChange = filter => {
    return checked => this.onFilterChange(filter, checked);
  };

  onSortByChange = (sortBy, checked) => {
    if (!checked) {
      // 默认的排序方式
      sortBy = "latest_msg_ts";
    }
    dispatchDomainType(this.context, this.props, "myHandling/changeListSortBy", sortBy);
  };

  getSortByCheckboxOnChange = sortBy => {
    return e => this.onSortByChange(sortBy, e.target.checked);
  };

  renderSortByMenu() {
    const { myHandlingData } = this.props;
    const { listSortBy } = myHandlingData;
    return (
      <Menu>
        <Menu.Item>
          <Checkbox checked={listSortBy === "latest_msg_ts"} onChange={this.getSortByCheckboxOnChange("latest_msg_ts")}>
            最近消息
          </Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox checked={listSortBy === "oldest_msg_ts"} onChange={this.getSortByCheckboxOnChange("oldest_msg_ts")}>
            最久消息
          </Checkbox>
        </Menu.Item>
      </Menu>
    );
  }

  renderHeader() {
    const { myHandlingData } = this.props;
    const { listSearch, listSessions, listFilters } = myHandlingData;
    return (
      <div className={styles.header}>
        <Search
          placeholder="用户名/手机号/用户ID/标签"
          style={{ width: "100%" }}
          value={listSearch}
          onChange={this.onSearchChange}
          onSearch={this.onSearch}
        />
        <div className={styles.options}>
          <Switch
            size="small"
            checked={listFilters.isOnline}
            checkedChildren="在线"
            unCheckedChildren="在线"
            onChange={this.getFilterSwitchOnChange("isOnline")}
          />
          <Switch
            size="small"
            checked={listFilters.hasUnread}
            checkedChildren="未读"
            unCheckedChildren="未读"
            onChange={this.getFilterSwitchOnChange("hasUnread")}
          />
          <Switch
            size="small"
            checked={listFilters.isOpened}
            checkedChildren="打开"
            unCheckedChildren="打开"
            onChange={this.getFilterSwitchOnChange("isOpened")}
          />
          <Dropdown overlay={this.renderSortByMenu()}>
            <Button size="small">
              排序 <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
      </div>
    );
  }

  getSessionList() {
    const { appData, data, myHandlingData } = this.props;
    const { sessions, projects } = data;
    const {
      listSessions,
      listSearch,
      listFilters,
      listSortBy,
      currentOpenedSession,
      openedSessionsState
    } = myHandlingData;
    const sessionList = [];
    for (let id of listSessions) {
      const session = sessions[id];
      const project = projects[session.project_id];
      const owner = appData.customers[project.owner];
      const isCurrentOpened = currentOpenedSession === session.id;
      if (!isCurrentOpened) {
        // filters
        //// search
        if (!!listSearch) {
          if (!anyIs([owner.uid, owner.name, owner.mobile, ...project.tags], v => v.indexOf(listSearch) !== -1)) {
            continue;
          }
        }

        //// is_online
        if (listFilters.isOnline) {
          if (!project.is_online) {
            continue;
          }
        }
        //// has_unread
        if (listFilters.hasUnread) {
          if (session.sync_msg_id >= session.msg_id) {
            continue;
          }
        }
        //// is_opened
        if (listFilters.isOpened) {
          if (!(session.id in openedSessionsState)) {
            continue;
          }
        }
      }
      // 包含进project
      sessionList.push({ ...session, project, isCurrentOpened: isCurrentOpened });
    }
    // sort
    switch (listSortBy) {
      case "latest_msg_ts":
        sessionList.sort((s1, s2) => -(get_session_last_msg_ts(s1, 0) - get_session_last_msg_ts(s2, 0)));
        break;
      case "oldest_msg_ts":
        sessionList.sort((s1, s2) => +(get_session_last_msg_ts(s1, 0) - get_session_last_msg_ts(s2, 0)));
        break;
    }
    return sessionList;
  }

  render() {
    const { myHandlingData } = this.props;
    const { currentOpenedSession, openedSessionsState } = myHandlingData;
    const currentOpenedSessionState = openedSessionsState[currentOpenedSession];
    const sessionList = this.getSessionList();
    return (
      <div className={styles.main}>
        {this.renderHeader()}
        <div className={styles.body}>
          <AutoSizer nonce="MsgItemList">
            {({ width, height }) => (
              <List
                className={styles.list}
                deferredMeasurementCache={this.cache}
                width={width}
                height={height}
                rowCount={sessionList.length}
                rowHeight={this.cache.rowHeight}
                rowRenderer={this.rowRenderer}
                noRowsRenderer={this.noRowsRenderer}
                sessionList={sessionList}
                currentOpenedSessionState={currentOpenedSessionState}
                openedSessionsState={openedSessionsState}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }

  rowRenderer = ({ index, key, style, parent }) => {
    const { width } = parent.props;
    const { appData } = this.props;
    const { sessionList, currentOpenedSessionState, openedSessionsState } = parent.props;
    const session = sessionList[index];
    const { msg } = session;
    const project = session.project;
    const owner = appData.customers[project.owner];
    // 当前打开并且不处在阅读状态则未读不显示
    const unread =
      session.isCurrentOpened && !currentOpenedSessionState.isInRead ? 0 : get_session_unsynced_count(session);
    const item = {
      id: session.id,
      name: genCustomerMobileName(owner),
      description: msgRendererService.describeMsg(msg),
      online: project.is_online,
      ts: get_session_last_msg_ts(session, "-"),
      selected: session.isCurrentOpened,
      opened: session.id in openedSessionsState,
      unread
    };
    return (
      <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ measure }) => (
          <div style={style}>
            <SessionItem
              ctx={{ width }}
              opened={item.opened}
              selected={item.selected}
              onClick={() => this.onClick(session.id)}
              name={item.name}
              description={item.description}
              ts={item.ts}
              unread={item.unread}
              online={item.online}
              tags={project.tags}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  noRowsRenderer = () => <EmptyContent />;

  onClick = id => {
    const { myHandlingData: { currentOpenedSession } } = this.props;
    if (id !== currentOpenedSession) {
      // 加入到打开的会话中
      dispatchDomainType(this.context, this.props, "myHandling/openSession", id);
    }
  };
}
