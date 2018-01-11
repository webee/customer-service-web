import React, { Component } from "react";
import Loader from "~/components/Loader";
import { connect } from "dva";
import { Route, Link, Switch, Redirect } from "dva/router";
import { Menu, Icon, Switch as SwitchComp, Modal, Form, Row, Col, Avatar, Dropdown } from "antd";
import { getRootPath } from "../commons/router";
const { SubMenu, ItemGroup } = Menu;
import { env } from "../config";
import MainLayout from "../components/layouts/MainLayout";
import MainLayoutStyles from "../components/layouts/MainLayout.less";
import styles from "./Main.less";

// function getProjectDomainNavData(projectDomains) {
//   return projectDomains.map(d => ({
//     icon: 'message', title: d.title, pathname: d.name, open: true, noLink: true,
//     items: d.types.map(t => ({title: t.title, pathname: t.name, fixed: true, noHeader: true, noBreadcrumb: true, noFooter: true}))
//   }));
// }
//
// function getNavData(projectDomains) {
//   return [
// 		{icon: 'home', title: '首页', pathname: '', component: require('../routes/Home').default},
// 		{icon: 'message', title: '项目', pathname: 'projects', noLink: true,
//       instance: {
//         pathname: ':projectDomain/:projectType',
//         component: require('../routes/Projects').default,
//         items: getProjectDomainNavData(projectDomains),
//       },
//     },
// 		{icon: 'setting', title: '设置', pathname: 'setting', component: require('../routes/Setting').default},
//   ];
// }

const asProjectDomainType = (projectDomain, projectType) => {
  return WrappedComponent => props => (
    <WrappedComponent projectDomain={projectDomain} projectType={projectType} {...props} />
  );
};

function getProjectDomainNavData(projectDomains, settings = {}) {
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
          defPath: "my_handling",
          instance: {
            pathname: ":tab",
            component: asProjectDomainType(d.name, t.name)(require("../routes/Projects").default),
            fixed: true,
            noHeader: !!settings.disable_session_header,
            noBreadcrumb: true,
            noFooter: true,
            menuless: true,
            items: [
              {
                title: `${t.title}/我的接待`,
                pathname: "my_handling"
              },
              {
                title: `${t.title}/正在接待`,
                pathname: "handling",
                fixed: true,
                noFooter: true
              },
              {
                title: `${t.title}/最近接待`,
                pathname: "handled",
                fixed: true,
                noFooter: true
              }
            ]
          }
        };
      })
    };
  });
}

const _prevData = {};

function getNavData(title, projectDomains, settings) {
  if (_prevData.title == title && _prevData.projectDomains == projectDomains && _prevData.settings == settings) {
    return _prevData.navData;
  }
  console.log("getNavData: ", title, projectDomains, settings);
  const navData = {
    icon: "rocket",
    title: title,
    defPath: "",
    noMatch: undefined,
    items: [
      {
        icon: "home",
        title: "首页",
        pathname: "",
        component: require("../routes/Home").default
      },
      ...getProjectDomainNavData(projectDomains, settings),
      {
        icon: "team",
        title: "客服",
        pathname: "staffs",
        component: require("../routes/Staffs").default
      },
      {
        icon: "setting",
        title: "设置",
        pathname: "setting",
        component: require("../routes/Setting").default
      }
    ]
  };
  Object.assign(_prevData, { title, projectDomains, settings, navData });
  return navData;
}

class Main extends React.Component {
  state = {
    showSettingModal: false
  };

  updateUISettings = settings => {
    const { dispatch } = this.props;
    dispatch({
      type: "app/setUISettings",
      payload: settings
    });
  };

  toggleBreadcrumb = checked => {
    this.updateUISettings({ disable_breadcrumb: !checked });
  };

  toggleFooter = checked => {
    this.updateUISettings({ disable_footer: !checked });
  };

  toggleSessionHeader = checked => {
    this.updateUISettings({ disable_session_header: !checked });
  };

  updateSettingModalState = show => {
    this.setState({ showSettingModal: show }, () => {
      this.forceUpdate();
    });
  };
  handleSettingUI = () => {
    this.updateSettingModalState(true);
  };

  settingModalOnOk = e => {
    this.updateSettingModalState(false);
  };

  settingModalOnCancel = e => {
    this.updateSettingModalState(false);
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
        <Menu.Item key="user/logout">
          <Link to={{ pathname: "/auth/logout", state: { state: { from: location } } }}>
            <Icon type="logout" />退出登录
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={MainLayoutStyles.right}>
        {env === "dev" ? (
          <Link to="/_" className={MainLayoutStyles.action}>
            <Icon type="code" />Test
          </Link>
        ) : (
          undefined
        )}
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
    const gutterSpecs = { xs: 8, sm: 8, md: 8, lg: 12, xl: 12 };
    const colSpanSpecs = { sm: 24, md: 16, lg: 12, xl: 8 };
    return showSettingModal ? (
      <Modal
        title="界面设置"
        visible={showSettingModal}
        onOk={this.settingModalOnOk}
        onCancel={this.settingModalOnCancel}
      >
        <Form className={styles.settingForm}>
          <Row gutter={gutterSpecs}>
            <Col {...colSpanSpecs}>
              <Form.Item label="面包屑">
                <SwitchComp
                  checkedChildren="显示"
                  unCheckedChildren="隐藏"
                  defaultChecked={!ui_settings.disable_breadcrumb}
                  onChange={this.toggleBreadcrumb}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="脚标">
                <SwitchComp
                  checkedChildren="显示"
                  unCheckedChildren="隐藏"
                  defaultChecked={!ui_settings.disable_footer}
                  onChange={this.toggleFooter}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="会话时导航栏">
                <SwitchComp
                  checkedChildren="显示"
                  unCheckedChildren="隐藏"
                  defaultChecked={!ui_settings.disable_session_header}
                  onChange={this.toggleSessionHeader}
                />
              </Form.Item>
            </Col>
          </Row>
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

    const navData = getNavData(app.title, projectDomains, ui_settings);

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
