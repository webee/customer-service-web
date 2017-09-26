import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'dva';
import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import BreadcrumbComp from './commons/BreadcrumbComp';
import SiderComp from './commons/SiderComp';
const { Header, Content, Footer } = Layout;
const {SubMenu, ItemGroup} = Menu;
import styles from './MainLayout.less';
import * as authService from '../services/auth';
import { env } from '~/config';

// components
import NotFoundPage from './NotFound';
import HomePage from './Home';
import SettingPage from './Setting';

export const urlNameMap = {
  '/': '首页',
  '/setting': '设置',
};

const siderMenuConfigs = {
	theme: 'dark',
	mode: 'inline',
	items: [
		{icon: 'home', title: '首页', pathname: ''},
    {icon: 'setting', title: '设置', pathname: 'setting'},
	],
};


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

  componentDidMount() {
    const { dispatch, authenticated } = this.props;
    if (!authenticated) {
      dispatch({type: 'auth/authenticate'});
    }
  }

  render() {
    const { location } = this.props;
    if (!authService.isAuthenticated()) {
      return (
        <Redirect to={{pathname: '/auth', state: { from: location }}}/>
      );
    }
    const { match, authenticated } = this.props;
    const root_path = match.path.endsWith('/') ? match.path.substr(0, match.path.length - 1) : match.path;
    return (
      <Loader loaded={authenticated}>
      <Layout loading={true} className="ant-layout-has-sider">
        <SiderComp app_name="测试应用" collapsed={this.state.collapsed} onCollapse={this.onCollapse} menuConfigs={siderMenuConfigs} />
        {/*<Layout style={{ marginLeft: this.state.collapsed ? 64 : 200 }}>*/}
				<Layout className={styles.main}>
          <Header className={styles.header}>
            <Icon className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggleCollapse}
            />
            <Menu className={styles.header_menu}
              mode="horizontal" selectedKeys={[]}>
              <Menu.Item key="home">
                <Link to="/"><Icon type="home" /><span>Home</span></Link>
              </Menu.Item>
              {env == "dev" ? <Menu.Item key="test">
                <Link to="/_"><Icon type="code" /><span>Test</span></Link>
              </Menu.Item> : ""}

              <SubMenu title={<span><Icon type="user" />webee</span>}>
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                  <ItemGroup title="设置">
										<Menu.Item key="setting:3">Option 1</Menu.Item>
										<Menu.Item key="setting:4">Option 2</Menu.Item>
									</ItemGroup>
              </SubMenu>
            </Menu>
					</Header>
          <Content className={styles.content}>
            <BreadcrumbComp urlNameMap={urlNameMap}/>
            <div className={styles.contentMain}>
              <Switch>
                <Route exact path={`${root_path}/`} component={HomePage} />
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
      </Loader>
    );
  }
}


function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps)(MainLayout);
