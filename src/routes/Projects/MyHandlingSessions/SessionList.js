import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import { dispatchDomainType, dispatchDomainTypeEffect } from "~/services/project";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import SessionItem from "./SessionItem";
import { Input, Checkbox } from "antd";
import Moment from "react-moment";
import styles from "./SessionList.less";

const Search = Input.Search;

@connect()
export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  getRowRenderer() {
    const { data } = this.props;
    const { sessions, listSessions, currentOpenedSession } = data;
    return ({ index, key, style }) => {
      const session = sessions[listSessions[index]];
      const item = {
        id: session.id,
        name: session.owner.name,
        description: `${session.msg.type}:${session.msg.content}`,
        online: session.is_online,
        ts: session.msg.ts,
        unread: session.msg_id - session.sync_msg_id
      };
      return (
        <div key={key} className={styles.item} style={style}>
          <SessionItem
            selected={item.id === currentOpenedSession}
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
  }

  noRowsRenderer = () => <p>没有会话</p>;

  onClick = id => {
    // 加入到打开的会话中
    dispatchDomainType(this.context, this.props, "myHandling/openSession", id);
  };

  render() {
    const { projectDomain, projectType } = this.context;
    const { data } = this.props;
    const { sessions, listSessions } = data;
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <Search placeholder="uid/name" style={{ width: "100%" }} onSearch={value => console.log(value)} />
          <Checkbox>在线</Checkbox>
          <Checkbox>待回</Checkbox>
        </div>
        <div className={styles.body}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                className={styles.list}
                width={width}
                height={height}
                rowCount={listSessions.length}
                rowHeight={60}
                rowRenderer={this.getRowRenderer()}
                noRowsRenderer={this.noRowsRenderer}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}
