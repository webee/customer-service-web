import React, { Fragment } from "react";
import { Link } from "dva/router";
import { Layout, Menu, Icon, Avatar, Dropdown, BackTop, Divider } from "antd";
import styles from "./index.less";
const { Header } = Layout;

export default class extends React.PureComponent {
  render() {
    const { root_path, hideSider, headerMenu, collapsed, onCollapse, onLogoClick } = this.props;
    return (
      <Header className={styles.header}>
        {hideSider && (
          <Fragment>
            <Link to={root_path} className={styles.logo}>
              <Icon type="rocket" style={{ color: "green", fontSize: "32px" }} onClick={onLogoClick} />
            </Link>
            <Divider type="vertical" key="line" />
          </Fragment>
        )}
        <Icon
          className={styles.trigger}
          type={collapsed ? "menu-unfold" : "menu-fold"}
          onClick={() => onCollapse(!collapsed)}
        />
        <div className={styles.right}>{headerMenu}</div>
      </Header>
    );
  }
}
