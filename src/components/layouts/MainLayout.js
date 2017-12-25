import React, { Component } from "react";
import classNames from "classnames";
import DocumentTitle from "react-document-title";
import { withRouter, Route, Link, Switch, Redirect } from "dva/router";
import { getRootPath, Routes } from "../../commons/router";
import { getURLDataMapFromNavData, getMenuDataFromNavData } from "../../commons/nav";
import { Layout, Menu, Icon, Avatar, Dropdown, BackTop } from "antd";
import Breadcrumb from "./Breadcrumb";
import SiderMenu from "./SiderMenu";
import styles from "./MainLayout.less";
const { Header, Content, Footer } = Layout;

@withRouter
export default class extends React.PureComponent {
  state = {
    collapsed: false
  };
  onCollapse = (collapsed, type) => {
    this.setState({ collapsed });
  };

  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { match, location, headerMenu, navData, onLogoClick } = this.props;
    const { title: name } = navData;
    const { bottom } = this.props;
    // 以navData为基础生成1. 导航菜单，2. 面包屑 3. routes
    console.debug("MainLayout, navData: ", navData);
    const root_path = getRootPath(match.path);
    console.debug("MainLayout, root_path: ", root_path);
    const path = location.pathname.replace(/\/*$/, "") || "/";
    const urlDataMap = getURLDataMapFromNavData(root_path, navData.items);
    const menuData = getMenuDataFromNavData(root_path, navData.items);
    console.debug("MainLayout, urlDatamap: ", urlDataMap);
    console.debug("MainLayout, path: ", path);
    const urlData = urlDataMap[path === "/" ? "" : path] || {};

    const disableBreadcrumb = this.props.disableBreadcrumb || urlData.noBreadcrumb;
    const disableFooter = this.props.disableFooter || urlData.noFooter;
    const disableHeader = this.props.disableHeader || urlData.noHeader;
    const fixed = urlData.fixed;

    const withTrigger = disableHeader;
    const contentClassName = classNames(styles.content, {
      [styles.fixedContent]: fixed
    });
    const contentMainClassName = classNames(styles.contentMain, {
      [styles.fixedContentMain]: fixed
    });
    const contentStyle = {};
    if (fixed) {
      contentStyle["height"] = disableFooter ? "calc(100vh - 64px)" : "calc(100vh - 64px - 48px)";
    }

    const layout = (
      <Layout className={`ant-layout-has-sider ${styles.layout}`}>
        <SiderMenu
          root_path={root_path}
          path={path}
          name={name}
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          onLogoClick={onLogoClick}
          withTrigger={withTrigger}
          theme="dark"
          mode="inline"
          menuData={menuData}
        />
        <Layout className={styles.main}>
          {disableHeader ? (
            ""
          ) : (
            <Header className={styles.header}>
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.toggleCollapse}
              />
              {headerMenu}
            </Header>
          )}
          <Content className={contentClassName} style={contentStyle}>
            {disableBreadcrumb ? "" : <Breadcrumb root_path={root_path} path={path} urlDataMap={urlDataMap} />}
            <div className={contentMainClassName}>
              <Routes path={root_path} navItems={navData.items} defPath={navData.defPath} noMatch={navData.noMatch} />
            </div>
          </Content>
          {disableFooter ? "" : <Footer className={styles.footer}>webee.yw(webee.yw@gmail.com) @2017</Footer>}
          {bottom}
        </Layout>
        {fixed ? "" : <BackTop target={() => document.getElementsByClassName(styles.main)[0]} visibilityHeight={500} />}
      </Layout>
    );

    // title
    let title = name;
    if (urlData) {
      title = `${urlData.title} - ${name}`;
    }
    return <DocumentTitle title={title}>{layout}</DocumentTitle>;
  }
}
