import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';
import { getRootPath, Routes } from '../../commons/router';
import { getURLDataMapFromNavData, getMenuDataFromNavData } from '../../commons/nav';
import NotFound from '../NotFound';
import { Layout, Menu, Icon, Avatar, Dropdown } from 'antd';
import Breadcrumb from './Breadcrumb';
import SiderMenu from './SiderMenu';
import styles from './MainLayout.less';
const { Header, Content, Footer } = Layout;


@withRouter
export default class MainLayout extends React.Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed, type) => {
    this.setState({collapsed});
  };

  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { match, location, name, headerMenu, navData, disableBreadcrumb, disableFooter } = this.props;
    const { onLogoClick } = this.props;
    const { bottom } = this.props;
    // 以navData为基础生成1. 导航菜单，2. 面包屑 3. routes
    console.debug('navData: ', navData);
    const root_path = getRootPath(match.path);
    const path = location.pathname.replace(/\/*$/,'') || '/';
    const urlDataMap = getURLDataMapFromNavData(root_path, navData);
    const menuData = getMenuDataFromNavData(root_path, navData);
    console.debug('urlDatamap: ', urlDataMap);
    console.debug('path: ', path);
    const urlData = urlDataMap[path === '/' ? '' : path] || {};

    const contentStyle = {height: disableFooter ? 'calc(100vh - 64px)' : 'calc(100vh - 64px - 48px)'};
    const layout = (
      <Layout className={`ant-layout-has-sider ${styles.layout}`}>
        <SiderMenu root_path={root_path} path={path}
                  name={name} collapsed={this.state.collapsed} onCollapse={this.onCollapse}
                  onLogoClick={onLogoClick}
                  theme="dark" mode="inline"
                  menuData={menuData} />
				<Layout className={styles.main}>
          <Header className={styles.header}>
						<Icon className={styles.trigger} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggleCollapse}/>
            {headerMenu}
					</Header>
          <Content className={styles.content} style={contentStyle}>
            { disableBreadcrumb || urlData.noBreadcrumb ? '' :
              <Breadcrumb root_path={root_path} path={path} urlDataMap={urlDataMap}/>
            }
            <Routes path={root_path} navData={navData} NoMatch={NotFound} />
          </Content>
          {disableFooter ||
          <Footer className={styles.footer}>
            webee.yw(webee.yw@gmail.com) @2017
          </Footer>
          }
          {bottom}
        </Layout>
      </Layout>
    );

    // title
    let title = name;
    if (urlData) {
      title = `${urlData.title} - ${name}`;
    }
    return (
      <DocumentTitle title={title}>
        {layout}
      </DocumentTitle>
    );
  }
}
