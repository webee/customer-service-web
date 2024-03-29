import React from "react";
import classNames from "classnames";
import moment from "moment";
import EllipsisText from "~/components/EllipsisText";
import { Avatar, Badge } from "antd";
import { TagsRenderer } from "../commons";
import styles from "./SessionItem.less";

export default class extends React.PureComponent {
  render() {
    const { ctx, name, description, ts, unread = 0, online, tags, selected, opened, onClick } = this.props;
    const { width } = ctx;
    const className = classNames(styles.main, { [styles.opened]: opened, [styles.selected]: selected });
    const avatarClassName = classNames({ [styles.online]: online });
    return (
      <div className={className} onClick={onClick}>
        <div className={styles.item}>
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
        <TagsRenderer tags={tags} maxWidth={width - 50} className={styles.tag} />
      </div>
    );
  }
}
