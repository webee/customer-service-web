import React, { Component } from "react";
import Loader from "react-loader";
import { connect } from "dva";
import { withRouter, Route, Link, Switch, Redirect } from "dva/router";
import { Menu, Icon, Switch as SwitchComp, Modal, Form, Avatar, Dropdown } from "antd";
import { getRootPath } from "../commons/router";
const { SubMenu, ItemGroup } = Menu;
import { env } from "../config";
import MainLayout from "../components/layouts/MainLayout";
import MainLayoutStyles from "../components/layouts/MainLayout.less";

// function getProjectDomainNavData(projectDomains) {
//   return projectDomains.map(d => ({
//     icon: 'message', title: d.title, pathname: d.name, open: true, noLink: true,
//     items: d.types.map(t => ({title: t.title, pathname: t.name, fixed: true, noHeader: true, noBreadcrumb: true, noFooter: true}))
//   }));
// }
//
// function getNavData(projectDomains) {
//   return [
// 		{icon: 'home', title: '首页', pathname: '', component: require('../routes/Home')},
// 		{icon: 'message', title: '项目', pathname: 'projects', noLink: true,
//       instance: {
//         pathname: ':projectDomain/:projectType',
//         component: require('../routes/Projects'),
//         items: getProjectDomainNavData(projectDomains),
//       }
//     },
// 		{icon: 'setting', title: '设置', pathname: 'setting', component: require('../routes/Setting')},
//   ];
// }

const asProjectDomainType = (projectDomain, projectType) => {
  return WrappedComponent => props => (
    <WrappedComponent projectDomain={projectDomain} projectType={projectType} {...props} />
  );
};

function getProjectDomainNavData(projectDomains) {
  return projectDomains.map(d => {
    return {
      icon: "message",
      title: d.title,
      pathname: `projects/${d.name}`,
      open: true,
      noLink: true,
      items: d.types.map(t => {
        return {
          title: t.title,
          pathname: t.name,
          component: asProjectDomainType(d.name, t.name)(require("../routes/Projects")),
          fixed: true,
          noHeader: true,
          noBreadcrumb: true,
          noFooter: true
        };
      })
    };
  });
}

function getNavData(projectDomains) {
  return [
    {
      icon: "home",
      title: "首页",
      pathname: "",
      component: require("../routes/Home")
    },
    ...getProjectDomainNavData(projectDomains),
    {
      icon: "setting",
      title: "设置",
      pathname: "setting",
      component: require("../routes/Setting")
    }
  ];
}

class Main extends React.Component {
  state = {
    showSettingModal: false
  };

  toggleBreadcrumb = checked => {
    const { dispatch } = this.props;
    dispatch({
      type: "app/setUISettings",
      payload: { disable_breadcrumb: !checked }
    });
  };

  toggleFooter = checked => {
    const { dispatch } = this.props;
    dispatch({
      type: "app/setUISettings",
      payload: { disable_footer: !checked }
    });
  };

  handleSettingUI = () => {
    this.setState({ showSettingModal: true });
  };

  settingModalOnOk = e => {
    console.debug(e);
    this.setState({ showSettingModal: false });
  };

  settingModalOnCancel = e => {
    console.debug(e);
    this.setState({ showSettingModal: false });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // load ui settings
    dispatch({ type: "app/loadUISettings" });
    // fetch app info
    dispatch({ type: "app/fetchAppInfo" });
    // open xchat
    dispatch({ type: "app/openXChat" });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "app/closeXChat" });
  }

  onLogoClick = () => {
    const { dispatch } = this.props;
    dispatch({ type: "app/fetchAppInfo" });
  };

  getHeaderMenu() {
    const { staff, location } = this.props;
    console.log("location:", location);
    const menu = (
      <Menu className={MainLayoutStyles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user/home" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="user/setting" />设置
        </Menu.Item>
        <Menu.Item key="user/logout">
          <Link to={{ pathname: "/auth/logout", state: { from: location } }}>
            <Icon type="logout" />退出登录
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <ItemGroup title="常用位置">
          <Menu.Item key="user/common/baidu">
            <a href="https://baidu.com" target="_blank">
              百度
            </a>
          </Menu.Item>
        </ItemGroup>
      </Menu>
    );

    return (
      <div className={MainLayoutStyles.right}>
        <Link to="/_" className={MainLayoutStyles.action}>
          <Icon type="code" />Test
        </Link>
        <span className={MainLayoutStyles.action} onClick={this.handleSettingUI}>
          <Icon type="setting" />界面设置
        </span>
        <Dropdown overlay={menu}>
          <span className={`${MainLayoutStyles.action} ${MainLayoutStyles.account}`}>
            <Avatar size="small" className={MainLayoutStyles.avatar} icon="user" />
            {staff.name}
          </span>
        </Dropdown>
      </div>
    );
  }

  getBottom() {
    const { showSettingModal } = this.state;
    const { ui_settings } = this.props;
    return showSettingModal ? (
      <Modal
        title="界面设置"
        visible={showSettingModal}
        onOk={this.settingModalOnOk}
        onCancel={this.settingModalOnCancel}
      >
        <Form>
          <Form.Item label="面包屑" labelCol={{ span: 4 }}>
            <SwitchComp
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              defaultChecked={!ui_settings.disable_breadcrumb}
              onChange={this.toggleBreadcrumb}
            />
          </Form.Item>
          <Form.Item label="脚标" labelCol={{ span: 4 }}>
            <SwitchComp
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              defaultChecked={!ui_settings.disable_footer}
              onChange={this.toggleFooter}
            />
          </Form.Item>
        </Form>
      </Modal>
    ) : (
      ""
    );
  }

  render() {
    const { match, location } = this.props;
    const root_path = getRootPath(match.path);
    const { staff, app, projectDomains, ui_settings } = this.props;
    const loaded = staff && app && projectDomains;
    if (!loaded) {
      return <Loader loaded={false} />;
    }

    const navData = getNavData(projectDomains);

    return (
      <MainLayout
        name={app.title}
        headerMenu={this.getHeaderMenu()}
        navData={navData}
        disableBreadcrumb={ui_settings.disable_breadcrumb}
        disableFooter={ui_settings.disable_footer}
        onLogoClick={this.onLogoClick}
        bottom={this.getBottom()}
      />
    );
  }
}

function mapStateToProps(state) {
  const appData = state.app;
  return {
    ui_settings: appData.ui_settings,
    staff: appData.staff,
    app: appData.app,
    projectDomains: appData.projectDomains,
  };
}

export default connect(mapStateToProps)(Main);
