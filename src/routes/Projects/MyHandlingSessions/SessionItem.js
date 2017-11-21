import React from "react";
import classNames from 'classnames';
import moment from 'moment';
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { Avatar, Badge } from "antd";
import styles from "./SessionItem.less";

export default ({ name, description, ts, unread, online, style, selected, onClick }) => {
  const className = classNames(styles.main, {[styles.selected]: selected})
  const avatarClassName = classNames({[styles.active]: online})
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <div className={className} style={{width, ...style}} onClick={onClick}>
          <div className={styles.avatar}>
            <Badge count={unread || 0} overflowCount={9}>
              <Avatar
                className={avatarClassName}
                shape="square"
                size="large"
                icon="user"
              />
            </Badge>
          </div>
          <div className={styles.description}>
            <div className={styles.top}>
              <div className={styles.title}><b>{name}</b></div>
              <div className={styles.body}>{typeof(ts) === "string" ? ts : moment.unix(ts).fromNow()}</div>
            </div>
            <div className={classNames(styles.bottom, styles.body)}>
              {description}
            </div>
          </div>
        </div>
      )}
    </AutoSizer>
  );
};