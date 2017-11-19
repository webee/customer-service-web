import React from 'react';
import { Menu, Dropdown, Avatar, Icon } from 'antd';
import { Link } from 'dva/router';
import MainLayout from '../components/layouts/MainLayout';
import MainLayoutStyles from '../components/layouts/MainLayout.less';


const navData = [
		{icon: 'home', title: '首页', pathname: '', fixed: true, noHeader: true, noBreadcrumb: true, noFooter: true, component: require('../routes/_Test/Home')},
    {icon: 'star', title: '普通组件', pathname: 'general', open: true, def: 'button',
      items: [
        {icon: 'gift', title: '按钮', pathname: 'button', noBreadcrumb: true, component: require('../routes/_Test/General/Button')},
        {icon: 'gift', title: '图标', pathname: 'icon', fixed: true, component: require('../routes/_Test/General/Icon')},
      ]
    },
    {icon: 'layout', title: '布局组件', pathname: 'layout', def: 'grid', noLink: true,
      items: [
        {icon: 'gift', title: '栅格', pathname: 'grid', component: require('../routes/_Test/Layout/Grid')},
        {icon: 'gift', title: '区块', pathname: 'blocks', fixed: true, component: require('../routes/_Test/Layout/Blocks')},
        {icon: 'gift', title: '测试', pathname: 'test', fixed: true, component: require('../routes/_Test/Layout/Test')},
      ]
    },
    {icon: 'layout', title: '数据展示', pathname: 'dataDisplay', def: 'etc',
      items: [
        {icon: 'gift', title: '杂项', pathname: 'etc', fixed: true, noFooter: true, component: require('../routes/_Test/DataDisplay')},
        {icon: 'gift', title: '聊天', pathname: 'chat', fixed: true, noFooter: true, component: require('../routes/_Test/DataDisplay/ChatEtc')},
      ]
    },
    {icon: 'heart', title: '列表', pathname: 'list', component: require('../routes/_Test/List')},
];


export default class _Test extends React.Component {
  getHeaderMenu() {
    const menu = (
      <Menu className={MainLayoutStyles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
        <Menu.Item key="setting:3">Option 1</Menu.Item>
        <Menu.Item key="setting:4">Option 2</Menu.Item>
      </Menu>
    );

    return (
      <div className={MainLayoutStyles.right}>
          <Link to="/" className={MainLayoutStyles.action}><Icon type="home" />App</Link>
          <Dropdown overlay={menu}>
            <span className={`${MainLayoutStyles.action} ${MainLayoutStyles.account}`}>
            <Avatar size="small" className={MainLayoutStyles.avatar} icon="user" />
              {"test"}
            </span>
          </Dropdown>
      </div>
    );
  }

  render() {
    return (
      <MainLayout name="测试页面" headerMenu={this.getHeaderMenu()} navData={navData}/>
    );
  }
}
