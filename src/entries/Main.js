import React, { Component } from "react";
import Loader from "~/components/Loader";
import { connect } from "dva";
import { Route, Link, Switch, Redirect } from "dva/router";
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
//       },
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
  // NOTE: 这里也可以消除domain这一级，铺平pathname
  return projectDomains.map(d => {
    return {
      icon: "message",
      title: d.title,
      pathname: `projects/${d.name}`,
      open: true,
      noLink: true,
      defPath: d.types[0].name,
      items: d.types.map(t => {
        return {
          title: t.title,
          pathname: t.name,
          fixed: true,
          noHeader: true,
          noBreadcrumb: true,
          noFooter: true,
          defPath: "my_handling",
          instance: {
            pathname: ":tab",
            component: asProjectDomainType(d.name, t.name)(require("../routes/Projects")),
            fixed: true,
            noHeader: true,
            noBreadcrumb: true,
            noFooter: true,
            noMenu: true,
            items: [
              {
                title: `${t.title}/我的接待`,
                pathname: "my_handling"
              },
              {
                title: `${t.title}/正在接待`,
                pathname: "handling"
              },
              {
                title: `${t.title}/最近接待`,
                pathname: "handled"
              }
            ]
          }
        };
      })
    };
  });
}

function getNavData(title, projectDomains) {
  return {
    icon: "rocket",
    title: title,
    defPath: "",
    noMatch: undefined,
    items: [
      {
        icon: "home",
        title: "首页",
        pathname: "",
        component: require("../routes/Home")
      },
      ...getProjectDomainNavData(projectDomains),
      {
        icon: "team",
        title: "客服",
        pathname: "staffs",
        component: require("../routes/Staffs")
      },
      {
        icon: "setting",
        title: "设置",
        pathname: "setting",
        component: require("../routes/Setting")
      }
    ]
  };
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
    // fetch xfiles token
    dispatch({ type: "app/fetchXFilesInfo" });
    // open xchat
    dispatch({ type: "app/openXChat" });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "app/closeXChat" });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { location, ui_settings, staff, app, projectDomains } = this.props;
    return !(
      location == nextProps.location &&
      ui_settings == nextProps.ui_settings &&
      (staff && nextProps.staff && staff.updated == nextProps.staff.updated) &&
      app.updated == nextProps.app.updated
    );
  }

  onLogoClick = () => {
    const { dispatch } = this.props;
    dispatch({ type: "app/fetchAppInfo" });
  };

  getHeaderMenu() {
    const { staff, location } = this.props;
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
    const { app, projectDomains, ui_settings } = this.props;
    const loaded = !!app;
    if (!loaded) {
      return <Loader />;
    }

    const navData = getNavData(app.title, projectDomains);

    return (
      <MainLayout
        navData={navData}
        headerMenu={this.getHeaderMenu()}
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
  const { staff } = appData;
  return {
    ui_settings: appData.ui_settings,
    staff,
    app: appData.app,
    projectDomains: appData.projectDomains
  };
}

export default connect(mapStateToProps)(Main);
