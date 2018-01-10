import React from "react";
import classNames from "classnames";
import moment from "moment";
import EllipsisText from "~/components/EllipsisText";
import { Avatar, Badge, Tag } from "antd";
import styles from "./SessionItem.less";

export default ({ ctx, name, description, ts, unread = 0, online, tags, selected, opened, onClick }) => {
  const { width } = ctx;
  const className = classNames(styles.main, { [styles.opened]: opened, [styles.selected]: selected });
  const avatarClassName = classNames({ [styles.online]: online });
  return (
    <div className={className}>
      <div className={styles.item} onClick={onClick}>
        <div className={styles.avatar}>
          <Badge count={unread} overflowCount={99}>
            <Avatar className={avatarClassName} shape="square" size="large" icon="user" />
          </Badge>
        </div>
        <div className={styles.description}>
          <div className={styles.top}>
            <div className={styles.title}>
              <EllipsisText text={<b>{name}</b>} />
            </div>
            <div className={styles.ts}>{typeof ts === "string" ? ts : moment.unix(ts).fromNow()}</div>
          </div>
          <div className={styles.bottom}>
            <EllipsisText text={description} />
          </div>
        </div>
      </div>
      {tags.map((t, i) => (
        <Tag key={i} className={styles.tag} color="#2db7f5">
          <EllipsisText text={t} maxWidth={width - 50} />
        </Tag>
      ))}
    </div>
  );
};
