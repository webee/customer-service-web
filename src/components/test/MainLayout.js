import React, { Component } from 'react';
import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import BreadcrumbComp from '../commons/BreadcrumbComp';
import SiderComp from '../commons/SiderComp';
import { urlNameMap } from '../TestApp';
const { Header, Content, Footer } = Layout;
const {SubMenu, ItemGroup} = Menu;
import styles from './MainLayout.less';

// components
import NotFoundPage from './NotFound';
import HomePage from './Home';
import GeneralPage from './General';
import LayoutPage from './Layout';


const siderMenuConfigs = {
	theme: 'dark',
	mode: 'inline',
	items: [
		{icon: 'home', title: 'Home', pathname: ''},
    {icon: 'heart', title: 'General', pathname: 'general',
      items: [
        {icon: 'bars', title: 'Button', pathname: 'button'},
        {icon: 'bars', title: 'Icon', pathname: 'icon'},
      ]
    },
    {icon: 'heart', title: 'Layout', pathname: 'layout',
      items: [
        {icon: 'bars', title: 'Grid', pathname: 'grid'},
      ]
    },
	],
};


class MainLayout extends React.Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed, type) => {
    console.log('sider collapsed: ', collapsed, type);
    this.setState({collapsed});
  };

  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { match } = this.props;
    return (
      <Layout className="ant-layout-has-sider">
        <SiderComp collapsed={this.state.collapsed} onCollapse={this.onCollapse} menuConfigs={siderMenuConfigs} />
        {/*<Layout style={{ marginLeft: collapsed ? 64 : 200 }}>*/}
        <Layout>
          <Header className={styles.header}>
            <Icon className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggleCollapse}
            />
            <Menu className={styles.header_menu}
              mode="horizontal" selectedKeys={[]}>
              <Menu.Item key="home">
                <Icon type="home" /><span>Home</span>
              </Menu.Item>
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
            <div style={{ padding: 24, background: '#f8f8f8', minHeight: '90vh' }}>
              <Switch>
                <Route exact path={`${match.path}`} component={HomePage}/>
								<Route path={`${match.path}/general`} component={GeneralPage}/>
                <Route path={`${match.path}/layout`} component={LayoutPage}/>
                <Route component={NotFoundPage} />
							</Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', paddingBottom: '18px' }}>
            webee.yw(webee.yw@gmail.com) @2017
          </Footer>
        </Layout>
      </Layout>
    );
  }
}


export default withRouter(MainLayout);
