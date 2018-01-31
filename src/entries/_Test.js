import React, { Fragment } from "react";
import { connect } from "dva";
import { Menu, Dropdown, Avatar, Icon } from "antd";
import { Link } from "dva/router";
import MainLayout from "../components/layouts/MainLayout";
import LayoutHeaderStyles from "../components/layouts/Header/index.less";

const navData = {
  icon: "rocket",
  title: "测试页面",
  defPath: "",
  noMatch: undefined,
  items: [
    { icon: "home", title: "首页", pathname: "", component: require("../routes/_Test/Home").default },
    {
      icon: "message",
      title: "会话",
      pathname: "chat",
      fixed: true,
      noHeader: true,
      noBreadcrumb: true,
      noFooter: true,
      component: require("../routes/_Test/Chat").default
    },
    {
      icon: "star",
      title: "普通组件",
      pathname: "general",
      open: true,
      defPath: "button",
      items: [
        {
          icon: "gift",
          title: "按钮",
          pathname: "button",
          noBreadcrumb: true,
          component: require("../routes/_Test/General/Button").default
        },
        {
          icon: "gift",
          title: "图标",
          pathname: "icon",
          fixed: true,
          component: require("../routes/_Test/General/Icon").default
        }
      ]
    },
    {
      icon: "layout",
      title: "布局组件",
      pathname: "layout",
      defPath: "grid",
      noLink: true,
      items: [
        { icon: "gift", title: "栅格", pathname: "grid", component: require("../routes/_Test/Layout/Grid").default },
        {
          icon: "gift",
          title: "区块",
          pathname: "blocks",
          fixed: true,
          component: require("../routes/_Test/Layout/Blocks").default
        },
        {
          icon: "gift",
          title: "测试",
          pathname: "test",
          fixed: true,
          component: require("../routes/_Test/Layout/Test").default
        }
      ]
    },
    {
      icon: "layout",
      title: "数据展示",
      pathname: "dataDisplay",
      defPath: "etc",
      items: [
        {
          icon: "gift",
          title: "杂项",
          pathname: "etc",
          fixed: true,
          noFooter: true,
          component: require("../routes/_Test/DataDisplay").default
        }
      ]
    },
    { icon: "heart", title: "列表", pathname: "list", component: require("../routes/_Test/List").default }
  ]
};

@connect(state => {
  const ui = state.ui;
  return {
    ui
  };
})
export default class _Test extends React.Component {
  onLayoutInfoUpdate = (name, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "ui/updateLayoutInfo",
      payload: { name, values }
    });
  };

  getHeaderMenu() {
    const menu = (
      <Menu selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
        <Menu.Item key="setting:3">Option 1</Menu.Item>
        <Menu.Item key="setting:4">Option 2</Menu.Item>
        <Menu.Item key="setting:5">
          <a href="/projects/test/test/my_handling" target="cs_test">
            cs_test
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Fragment>
        <Link to="/" className={LayoutHeaderStyles.action}>
          <Icon type="home" />App
        </Link>
        <Dropdown overlay={menu}>
          <span className={`${LayoutHeaderStyles.action} ${LayoutHeaderStyles.account}`}>
            <Avatar size="small" className={LayoutHeaderStyles.avatar} icon="user" />
            {"test"}
          </span>
        </Dropdown>
      </Fragment>
    );
  }

  render() {
    const { ui } = this.props;
    return (
      <MainLayout
        navData={navData}
        headerMenu={this.getHeaderMenu()}
        uiSettings={ui.settings}
        layoutInfo={ui.layoutInfo}
        onLogoClick={this.onLogoClick}
        onLayoutInfoUpdate={this.onLayoutInfoUpdate}
      />
    );
  }
}
