import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import SessionItem from "./SessionItem";
import EmptyContent from "./EmptyContent";
import { Input, Checkbox, Button, Icon, Switch, Dropdown, Menu } from "antd";
import Moment from "react-moment";
import styles from "./SessionList.less";

const Search = Input.Search;

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
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
    const { listSessions, listFilters } = myHandlingData;
    return (
      <div className={styles.header}>
        <Search placeholder="uid/name" style={{ width: "100%" }} onSearch={value => console.log(value)} />
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
            checkedChildren="待回"
            unCheckedChildren="待回"
            onChange={this.getFilterSwitchOnChange("hasUnread")}
          />
          <Dropdown overlay={this.renderSortByMenu()}>
            <Button size="small" style={{ marginLeft: 8 }}>
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
    const { listSessions, listFilters, listSortBy, currentOpenedSession } = myHandlingData;
    const sessionList = [];
    for (let id of listSessions) {
      const session = sessions[id];
      const project = projects[session.project_id];
      const isCurrentOpened = currentOpenedSession === session.id;
      if (!isCurrentOpened) {
        // filters
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
      }
      // 包含进project
      sessionList.push({ ...session, project, isCurrentOpened: isCurrentOpened });
    }
    // sort
    switch (listSortBy) {
      case "latest_msg_ts":
        sessionList.sort((s1, s2) => -(s1.msg_ts - s2.msg_ts));
        break;
      case "oldest_msg_ts":
        sessionList.sort((s1, s2) => +(s1.msg_ts - s2.msg_ts));
        break;
    }
    return sessionList;
  }

  render() {
    const sessionList = this.getSessionList();
    return (
      <div className={styles.main}>
        {this.renderHeader()}
        <div className={styles.body}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                className={styles.list}
                width={width}
                height={height}
                rowCount={sessionList.length}
                rowHeight={60}
                rowRenderer={this.rowRenderer}
                noRowsRenderer={this.noRowsRenderer}
                sessionList={sessionList}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }

  rowRenderer = ({ index, key, style, parent }) => {
    const { sessionList } = parent.props;
    const session = sessionList[index];
    const project = session.project;
    const item = {
      id: session.id,
      name: project.owner.name,
      description: `${session.msg.type}:${session.msg.content}`,
      online: project.is_online,
      ts: session.msg.ts,
      unread: session.msg_id - session.sync_msg_id,
      selected: session.isCurrentOpened
    };
    return (
      <div key={key} className={styles.item} style={style}>
        <SessionItem
          selected={item.selected}
          onClick={() => this.onClick(session.id)}
          name={item.name}
          description={item.description}
          ts={item.ts}
          unread={item.unread}
          online={item.online}
        />
      </div>
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
