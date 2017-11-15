import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'dva';
import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';
import {getRootPath} from '../../commons/router';
import NotFound from '../NotFound';
import { Layout, Menu, Icon, Avatar, Dropdown } from 'antd';
import Breadcrumb from './Breadcrumb';
import SiderMenu from './SiderMenu';
import styles from './MainLayout.less';
const { Header, Content, Footer } = Layout;


function getURLNameMapFromNavData(root_path, navData) {
  let urlNameMap = {};
  navData.forEach(item => {
    const path = item.pathname ? `${root_path}/${item.pathname}` : root_path;
    urlNameMap[path] = item.title;
    if (item.items) {
      urlNameMap = { ...urlNameMap, ...getURLNameMapFromNavData(path, item.items)}
    }
  });
  return urlNameMap;
}

function getRoutesFromNavData(path, navData) {
  return getRouteDataFromNavData(path, navData).map(item => (
    <Route exact={item.exact} key={item.path} path={item.path}
      component={item.component}
      render={item.render}
    />
  ));
}

function getRouteDataFromNavData(root_path, navData) {
  return navData.map(item => {
    const { pathname, component, def } = item;
    let { render } = item;
    const exact = pathname === '';
    const path =  exact ? root_path : `${root_path}/${pathname}`;
    if (item.items) {
      render = ({match}) => {
        const { path } = match;
        return (
          <Switch>
            {getRoutesFromNavData(path, item.items)}
            {def && <Redirect to={`${path}/${def}`}/> }
          </Switch>
        );
      };
    }
    console.debug('route:', {exact, path, component, render});
    return {exact, path, component, render};
  });
}


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
    const { match, location, name, headerMenu, navData } = this.props;
    const root_path = getRootPath(match.path);
    const path = location.pathname.replace(/\/*$/,'') || '/';
    const urlNameMap = getURLNameMapFromNavData(root_path, navData);
    return (
      <Layout className="ant-layout-has-sider">
        <SiderMenu root_path={root_path} path={path}
                  name={name} collapsed={this.state.collapsed} onCollapse={this.onCollapse}
                  theme="dark" mode="inline"
                  navData={navData} />
				<Layout className={styles.main}>
          <Header className={styles.header}>
						<Icon className={styles.trigger} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggleCollapse}/>
            {headerMenu}
					</Header>
          <Content className={styles.content}>
            <Breadcrumb root_path={root_path} path={path} urlNameMap={urlNameMap}/>
            <div className={styles.contentMain}>
              <Switch>
                {getRoutesFromNavData(root_path, navData)}
                <Route component={NotFound} />
              </Switch>
            </div>
          </Content>
          <Footer className={styles.footer}>
            webee.yw(webee.yw@gmail.com) @2017
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
