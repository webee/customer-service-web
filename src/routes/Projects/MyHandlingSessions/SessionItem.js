import React from "react";
import classNames from "classnames";
import moment from "moment";
import { Avatar, Badge } from "antd";
import styles from "./SessionItem.less";

export default ({ name, description, ts, unread = 0, online, style, selected, opened, onClick }) => {
  const className = classNames(styles.main, { [styles.opened]: opened, [styles.selected]: selected });
  const avatarClassName = classNames({ [styles.online]: online });
  return (
    <div className={className} style={style} onClick={onClick}>
      <div className={styles.avatar}>
        <Badge count={unread} overflowCount={99}>
          <Avatar className={avatarClassName} shape="square" size="large" icon="user" />
        </Badge>
      </div>
      <div className={styles.description}>
        <div className={styles.top}>
          <div className={styles.title}>
            <b>{name}</b>
          </div>
          <div className={styles.ts}>{typeof ts === "string" ? ts : moment.unix(ts).fromNow()}</div>
        </div>
        <div className={styles.bottom}>{description}</div>
      </div>
    </div>
  );
};
