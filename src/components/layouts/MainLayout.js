import React, { Component } from "react";
import classNames from "classnames";
import DocumentTitle from "react-document-title";
import { ContainerQuery } from "react-container-query";
import enquire from "enquire.js";
import { withRouter, Route, Link, Switch, Redirect } from "dva/router";
import { getRootPath, Routes } from "../../commons/router";
import { getURLDataMapFromNavData, getMenuDataFromNavData } from "../../commons/nav";
import { Layout, Menu, Icon, Avatar, Dropdown, BackTop, Divider } from "antd";
import Breadcrumb from "./Breadcrumb";
import SiderMenu from "./SiderMenu";
import Header from "./Header";
import styles from "./MainLayout.less";
import { fullViewport } from "../../settings";
const { Content, Footer } = Layout;

const query = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200
  }
};

function enquireMobile(f) {
  enquire.register("screen and  (max-width: 991px)", {
    match() {
      f(true);
    },
    unmatch() {
      f(false);
    }
  });
}

let isMobile;
enquireMobile(v => {
  isMobile = v;
});

@withRouter
export default class extends React.PureComponent {
  state = {
    collapsed: false,
    isMobile: isMobile
  };
  onCollapse = (collapsed, type) => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    enquireMobile(v => {
      this.setState({ isMobile: v });
    });
    this._handleDisableSiderAndCollapse(false, this.props.disableSider);
  }

  componentWillReceiveProps(nextProps) {
    this._handleDisableSiderAndCollapse(this.props.disableSider, nextProps.disableSider);
  }

  _handleDisableSiderAndCollapse(cur, next) {
    if (!cur && next) {
      this.onCollapse(true);
    } else if (cur && !next) {
      this.onCollapse(false);
    }
  }

  render() {
    const { match, location, headerMenu, navData, onLogoClick } = this.props;
    const { title: name } = navData;
    const { bottom } = this.props;
    const { isMobile } = this.state;
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
    const hideSider = isMobile || this.props.disableSider;
    // 隐藏sider时强制显示header
    const disableHeader = hideSider ? false : this.props.disableHeader || urlData.noHeader;
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
      contentStyle["height"] = disableFooter
        ? `calc(${fullViewport}vh - 64px)`
        : `calc(${fullViewport}vh - 64px - 48px)`;
    }
    if (hideSider) {
      contentStyle["margin"] = "8px 0 0 0";
    }

    const layout = (
      <Layout className={`${styles.layout}`}>
        <SiderMenu
          root_path={root_path}
          path={path}
          name={name}
          hideSider={hideSider}
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
            <Header
              root_path={root_path}
              hideSider={hideSider}
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              onLogoClick={onLogoClick}
              headerMenu={headerMenu}
            />
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
    return (
      <DocumentTitle title={title}>
        <ContainerQuery query={query}>{params => <div className={classNames(params)}>{layout}</div>}</ContainerQuery>
      </DocumentTitle>
    );
  }
}
