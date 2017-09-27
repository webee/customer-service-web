import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import BreadcrumbComp from '../commons/BreadcrumbComp';
import SiderComp from '../commons/SiderComp';
import { RootRoute } from '../commons/router';
const { Header, Content, Footer } = Layout;
const {SubMenu, ItemGroup} = Menu;
import styles from './MainLayout.less';

// components
import NotFoundPage from './NotFound';
import HomePage from './Home';
import GeneralPage from './General';
import LayoutPage from './Layout';


const urlNameMap = {
  '/_': '首页',
  '/_/general': '普通组件',
  '/_/general/button': '按钮',
  '/_/general/icon': '图标',
  '/_/layout': '布局组件',
  '/_/layout/grid': '栅格',
  '/_/layout/layout': '布局',
};


const siderMenuConfigs = {
	theme: 'dark',
	mode: 'inline',
	items: [
		{icon: 'home', title: 'Home', pathname: ''},
    {icon: 'heart', title: 'General', pathname: 'general', open: true,
      items: [
        {icon: 'bars', title: 'Button', pathname: 'button'},
        {icon: 'bars', title: 'Icon', pathname: 'icon'},
      ]
    },
    {icon: 'heart', title: 'Layout', pathname: 'layout', open: true,
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

  componentDidMount() {
    console.log('test did mount');
    console.log('props: ', this.props);
    // fetch data
    this.props.dispatch({type: 'app/fetch'});
  }

  render() {
    const { match } = this.props;
    const {staff, app, project_domains } = this.props;
    return (
      <Layout className="ant-layout-has-sider">
        <SiderComp app_name="测试应用" collapsed={this.state.collapsed} onCollapse={this.onCollapse} menuConfigs={siderMenuConfigs} />
        {/*<Layout style={{ marginLeft: this.state.collapsed ? 64 : 200 }}>*/}
				<Layout className={styles.main}>
          <Header className={styles.header}>
						<Icon className={styles.trigger} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggleCollapse}/>
            <Menu className={styles.header_menu}
              mode="horizontal" selectedKeys={[]}>
              <Menu.Item key="home">
                <Link to="/"><Icon type="home" /><span>App</span></Link>
              </Menu.Item>
              <SubMenu title={<span><Icon type="user" />{staff?staff.name:'webee'}</span>}>
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
                <Route exact path={`${match.path}`} component={HomePage}/>
                <Route path={`${match.path}/general`} component={GeneralPage}/>
                <Route path={`${match.path}/layout`} component={LayoutPage}/>
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
