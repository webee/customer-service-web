import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'dva';
import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';
import { Menu, Icon, Switch as SwitchComp, Modal, Form, Avatar, Dropdown } from 'antd';
import { getRootPath } from '../commons/router';
const {SubMenu, ItemGroup} = Menu;
import { env } from '../config';
import MainLayout from '../components/layouts/MainLayout';
import MainLayoutStyles from '../components/layouts/MainLayout.less';


function getProjectDomainNavData(project_domains) {
  return project_domains.map(d => ({
    icon: 'message', title: d.title, pathname: d.name, open: true, noLink: true,
    items: d.types.map(t => ({title: t.title, pathname: t.name}))
  }));
}

function getNavData(project_domains) {
  return [
		{icon: 'home', title: '首页', pathname: '', component: require('../routes/Home')},
		{icon: 'message', title: '项目', pathname: 'projects', noLink: true,
      instance: {
        pathname: ':projectDomain/:projectType',
        component: require('../routes/Projects'),
        items: getProjectDomainNavData(project_domains),
      }
    },
		{icon: 'setting', title: '设置', pathname: 'setting', component: require('../routes/Setting')},
  ];
}


class Main extends React.Component {
  state = {
    collapsed: false,
    showSettingModal: false,
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
    switch (item.key) {
      case 'user/logout':
        const { dispatch } = this.props;
        dispatch({type: 'auth/logout', payload: `${root_path}/auth`});
        break;
      case 'ui-setting':
        this.setState({showSettingModal:true});
        break;
    }
  };

  onLogoClick = () => {
    this.props.dispatch({type: 'app/fetch'});
  };

  toggleBreadcrumb = (checked) => {
    const {dispatch} = this.props;
    dispatch({type: 'app/setUISettings', payload: {disable_breadcrumb: !checked}});
  };

  toggleFooter = (checked) => {
    const {dispatch} = this.props;
    dispatch({type: 'app/setUISettings', payload: {disable_footer: !checked}});
  };

  settingModalOnOk = (e) => {
    console.debug(e);
    this.setState({showSettingModal:false});
  };

  settingModalOnCancel = (e) => {
    console.debug(e);
    this.setState({showSettingModal:false});
  };

  componentDidMount() {
    console.log('props: ', this.props);
    // fetch data
    this.props.dispatch({type: 'app/fetch'});
  }

  getHeaderMenu(username) {
    const menu = (
      <Menu className={MainLayoutStyles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user/home" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="user/setting" />设置</Menu.Item>
        <Menu.Item key="user/logout"><Icon type="logout" />退出登录</Menu.Item>
        <Menu.Divider />
        <ItemGroup title="常用位置">
          <Menu.Item key="user/common/baidu">
            <a href="https://baidu.com" target="_blank">百度</a>
          </Menu.Item>
        </ItemGroup>
      </Menu>
    );

    return (
      <div className={MainLayoutStyles.right}>
          <Link to="/_" className={MainLayoutStyles.action}><Icon type="code" />Test</Link>
          <span className={MainLayoutStyles.action}><Icon type="setting" />界面设置</span>
          <Dropdown overlay={menu}>
            <span className={`${MainLayoutStyles.action} ${MainLayoutStyles.account}`}>
            <Avatar size="small" className={MainLayoutStyles.avatar} icon="user" />
              {username}
            </span>
          </Dropdown>
      </div>
    );
  }

  render() {
    const { match, location } = this.props;
    const root_path = getRootPath(match.path);
    const {staff, app, project_domains, ui_settings } = this.props;
    const loaded = staff && app && project_domains;
    if (!loaded) {
      return <Loader loaded={false}/>
    }

    const navData = getNavData(project_domains);

    return (
      <MainLayout name={app.title} headerMenu={this.getHeaderMenu(staff.name)} navData={navData}
                  disableBreadcrumb={ui_settings.disable_breadcrumb}
                  disableFooter={ui_settings.disable_footer}
      />
    );
  }
}


function mapStateToProps(state) {
  return {...state.app};
}

export default connect(mapStateToProps)(Main);
