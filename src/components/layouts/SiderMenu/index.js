import "rc-drawer-menu/assets/index.css";
import React from "react";
import { Link } from "dva/router";
import { Menu, Icon, Layout } from "antd";
import DrawerMenu from "rc-drawer-menu";
const { Sider } = Layout;
import MediaQuery from "react-responsive";
import Media from "react-media";
import { genMenuDataFromNavData } from "../../../commons/nav";
import styles from "./index.less";

const { SubMenu, ItemGroup } = Menu;

function findOpenKeys(path, menuData) {
  const openKeys = [];
  for (let i in menuData) {
    const item = menuData[i];
    if (item.items && (item.open || path.startsWith(item.path))) {
      openKeys.push(item.key);
      openKeys.push(...findOpenKeys(path, item.items));
    }
  }
  return openKeys;
}

function findSelectedKey(path, menuData) {
  let selectedKey = undefined;
  menuData.forEach(item => {
    if (path.startsWith(item.path)) {
      selectedKey = item.path;
      if (item.items) {
        selectedKey = findSelectedKey(path, item.items) || selectedKey;
      }
    }
  });
  return selectedKey;
}

function genMenuItems(items, onLinkClick = undefined) {
  return items.map(
    item =>
      item.items ? (
        <SubMenu
          key={item.key}
          title={
            item.icon ? (
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            ) : (
              item.title
            )
          }
        >
          {genMenuItems(item.items, onLinkClick)}
        </SubMenu>
      ) : (
        <Menu.Item key={item.key}>
          <Link to={item.path} onClick={onLinkClick}>
            {item.icon && <Icon type={item.icon} />}
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
      )
  );
}

export const SiderMenuComp = ({ collapsed, root_path, path, theme, mode, menuData, onLinkClick }) => {
  const openKeys = collapsed ? [] : findOpenKeys(path, menuData);
  const selectedKeys = [findSelectedKey(path, menuData)];
  console.debug("SiderMenuComp, path: ", path);
  console.debug("SiderMenuComp, menuData: ", menuData);
  console.debug("SiderMenuComp, openKeys: ", openKeys);
  console.debug("SiderMenuComp, selectedKeys: ", selectedKeys);

  // TODO: 解决弹出菜单hidden的问题,
  //      目前在collapsed的时候不处理overflow, 大部分情况可以处理
  const style = {};
  if (!collapsed) {
    style["overflow"] = "auto";
  }
  return (
    <Menu
      className={styles.menu}
      style={style}
      theme={theme}
      selectedKeys={selectedKeys}
      defaultOpenKeys={openKeys}
      mode={mode}
    >
      {genMenuItems(menuData, onLinkClick)}
    </Menu>
  );
};

const noOp = () => {};

class SiderMenu extends React.PureComponent {
  render() {
    const {
      root_path,
      path,
      name,
      collapsed,
      onCollapse,
      theme,
      mode,
      menuData,
      onLogoClick = noOp,
      onLinkClick,
      withTrigger = false
    } = this.props;
    return (
      <Sider
        className={styles.sider}
        collapsible
        breakpoint="xl"
        trigger={withTrigger ? undefined : null}
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className={styles.logo}>
          <Link to={root_path}>
            <Icon type="rocket" style={{ color: "green", fontSize: "32px" }} onClick={onLogoClick} />
            <h1>{name}</h1>
          </Link>
        </div>
        <SiderMenuComp {...{ collapsed, root_path, path, theme, mode, menuData, onLinkClick }} />
      </Sider>
    );
  }
}

export default props => {
  return props.hideSider ? (
    <DrawerMenu
      parent={null}
      level={null}
      iconChild={null}
      open={!props.collapsed}
      onMaskClick={() => {
        props.onCollapse(true);
      }}
      width="200px"
    >
      <SiderMenu {...props} collapsed={false} onLinkClick={() => props.onCollapse(true)} />
    </DrawerMenu>
  ) : (
    <SiderMenu {...props} />
  );
};
