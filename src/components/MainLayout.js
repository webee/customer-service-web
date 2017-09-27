import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'dva';
import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import {getRootPath} from './commons/router';
import BreadcrumbComp from './commons/BreadcrumbComp';
import SiderComp from './commons/SiderComp';
const { Header, Content, Footer } = Layout;
const {SubMenu, ItemGroup} = Menu;
import styles from './MainLayout.less';
import { env } from '~/config';

// components
import NotFoundPage from './NotFound';
import HomePage from './Home';
import ProjectsPage from './Projects';
import SettingPage from './Setting';


function genProjectDomainUrlNameMap(root, project_domains) {
  const urlNameMap = {};
  project_domains.forEach(d => {
    const dUrl = `${root}/${d.name}`;
    urlNameMap[dUrl] = {name: d.title, noLink: true};
    d.types.forEach(t => {
      const tUrl = `${dUrl}/${t.name}`;
      urlNameMap[tUrl] = t.title;
    });
  });
  return urlNameMap;
}

function genUrlNameMap(root, project_domains) {
  return {
    [`${root}/`]: '首页',
    [`${root}/projects`]: {name: '项目', noLink: true},
    ...genProjectDomainUrlNameMap(`${root}/projects`, project_domains),
    [`${root}/setting`]: '设置',
  };
}

function genProjectDomainMenuItemConfigs(root, project_domains) {
  return project_domains.map(d => ({
    icon: 'star-o', title: d.title, pathname: `${root}/${d.name}`, open: true,
    items: d.types.map(t => ({title: t.title, pathname: t.name}))
  }));
}

function genSiderMenuConfigs(project_domains) {
  return {
    theme: 'dark',
    mode: 'inline',
    items: [
      {icon: 'home', title: '首页', pathname: ''},
      ...genProjectDomainMenuItemConfigs('projects', project_domains),
      {icon: 'setting', title: '设置', pathname: 'setting'},
    ],
  };
}


class MainLayout extends React.Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed, type) => {
    console.debug('sider collapsed: ', collapsed, type);
    this.setState({collapsed});
  };

  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleMenuClick = (item) => {
    console.debug("click menu: ", item);
    const root_path = getRootPath(this.props.match.path);
    if (item.key === 'user/logout') {
      const { dispatch } = this.props;
      dispatch({type: 'auth/logout', payload: `${root_path}/auth`});
    }
  };

  onLogoClick = () => {
    this.props.dispatch({type: 'app/fetch'});
  };

  componentDidMount() {
    console.log('props: ', this.props);
    // fetch data
    this.props.dispatch({type: 'app/fetch'});
  }

  render() {
    const { match } = this.props;
    const root_path = getRootPath(match.path);
    const {staff, app, project_domains } = this.props;
    const loaded = staff && app && project_domains;
    if (!loaded) {
      return <Loader loaded={false}/>
    }
    return (
      <Layout className="ant-layout-has-sider">
        <SiderComp app_name={app.title} collapsed={this.state.collapsed}
                   onCollapse={this.onCollapse} onLogoClick={this.onLogoClick}
                   menuConfigs={genSiderMenuConfigs(project_domains)} />
				<Layout className={styles.main}>
          <Header className={styles.header}>
            <Icon className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggleCollapse}
            />
            {/* 顶部导航设置 */}
            <Menu className={styles.header_menu}
                  onClick={this.handleMenuClick}
                  mode="horizontal" selectedKeys={[]}>
              {env == "dev" ? <Menu.Item key="test">
                <Link to="/_"><Icon type="code" /><span>Test</span></Link>
              </Menu.Item> : ""}

              <SubMenu title={<span><Icon type="user" />{staff.name}</span>}
                       key="user"
              >
                  <Menu.Item key="user/logout">退出</Menu.Item>
                  <ItemGroup title="常用位置">
										<Menu.Item key="user/common/baidu">
                      <a href="https://baidu.com" target="_blank">百度</a>
                    </Menu.Item>
									</ItemGroup>
              </SubMenu>
            </Menu>
					</Header>
          <Content className={styles.content}>
            <BreadcrumbComp urlNameMap={genUrlNameMap(root_path, project_domains)}/>
            <div className={styles.contentMain}>
              {/* 主内容区路由设置 */}
              <Switch>
                <Route exact path={`${root_path}/`} component={HomePage} />
                <Route path={`${root_path}/projects/:projectDomain/:projectType`} component={ProjectsPage} />
								<Route path={`${root_path}/setting`} component={SettingPage}/>
                <Route component={NotFoundPage} />
							</Switch>
            </div>
            <Footer className={styles.footer}>
              webee.yw(webee.yw@gmail.com) @2017
            </Footer>
          </Content>
        </Layout>
      </Layout>
    );
  }
}


function mapStateToProps(state) {
  return {...state.app};
}

export default connect(mapStateToProps)(MainLayout);
