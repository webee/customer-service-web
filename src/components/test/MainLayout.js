import React, { Component } from 'react';
import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import BreadcrumbComp from '../commons/BreadcrumbComp';
import SiderMenuComp from '../commons/SiderMenuComp';
import { urlNameMap } from '../TestApp';
const { Sider, Header, Content, Footer } = Layout;
const {SubMenu, ItemGroup} = Menu;
import styles from './MainLayout.less';

// components
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
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { match } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider className={styles.sider}
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className={styles.logo}>
            <Link to={`${match.path}`}>
							<span>测试应用</span>
						</Link>
					</div>
          <SiderMenuComp menuConfigs={siderMenuConfigs}/>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header className={styles.header}>
            <Menu mode="horizontal" selectedKeys={[]}>
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
            <div style={{ padding: 24, background: '#f8f8f8', minHeight: 480 }}>
              <Switch>
                <Route exact path={`${match.path}`} component={HomePage}/>
								<Route path={`${match.path}/general`} component={GeneralPage}/>
                <Route path={`${match.path}/layout`} component={LayoutPage}/>
                <Redirect to={`${match.path}`} />
							</Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            webee.yw(webee.yw@gmail.com) @2017
          </Footer>
        </Layout>
      </Layout>
    );
  }
}


export default withRouter(MainLayout);
