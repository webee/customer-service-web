import { withRouter, Link } from 'dva/router';
import { Menu, Icon, Layout } from 'antd';
const { Sider } = Layout;
import MediaQuery from 'react-responsive';
import Media from 'react-media';
const {SubMenu, ItemGroup} = Menu;
import styles from './index.less';


/*
{key, icon, title, pathname, open, [items]}
 */
function genMenuDataFromNavData(root_path, navData) {
  return navData.map((item, _) => {
    let {icon, title, pathname, open, items} = item;
    let path = pathname;
    if (!pathname.startsWith('/')) {
      if (root_path.endsWith('/')) {
        path = pathname ? `${root_path}${pathname}`: root_path;
      } else {
        path = pathname ? `${root_path}/${pathname}`: root_path;
      }
    }

    const menuDataItem = {key: path, icon, title, path, open};
    if (item.items) {
      menuDataItem['items'] = genMenuDataFromNavData(path, item.items);
    }
    return menuDataItem;
  });
}

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
  let selectedKey = '';
  menuData.forEach(item => {
    if (path.startsWith(item.path)) {
      if (item.path.length > selectedKey.length) {
        selectedKey = item.path;
      }
      if (item.items) {
        const subSelectedKey = findSelectedKey(path, item.items);
        if (subSelectedKey) {
          selectedKey = subSelectedKey;
        }
      }
    }
  });
  return selectedKey;
}

function genMenuItems(items) {
  return items.map((item) => item.items ? (
      <SubMenu key={item.key} title={
          item.icon ? (<span><Icon type={item.icon} /><span>{item.title}</span></span>): item.title
      }>
        {genMenuItems(item.items)}
      </SubMenu>
  ) : (
      <Menu.Item key={item.key}>
        <Link to={item.path}>
          {item.icon && <Icon type={item.icon} /> }
          <span>{item.title}</span>
        </Link>
      </Menu.Item>
  ));
}


export const SiderMenuComp = ({root_path, path, theme, mode, navData}) => {
  const menuData = genMenuDataFromNavData(root_path, navData);
  const openKeys = findOpenKeys(path, menuData);
  const selectedKeys = [findSelectedKey(path, menuData)];
  console.debug('path', path);
  console.debug('menuData', menuData);
  console.debug('openKeys', openKeys);
  console.debug('selectedKeys', selectedKeys);

  return (
    <Menu theme={theme} selectedKeys={selectedKeys} defaultOpenKeys={openKeys} mode={mode}>
      {genMenuItems(menuData)}
		</Menu>
  );
};


const noOp = () => {};

export default withRouter(({root_path, path, name, collapsed, onCollapse, theme, mode, navData, onLogoClick=noOp}) => {
  return (
      <Sider className={styles.sider}
             collapsible
             breakpoint="lg"
             collapsed={collapsed}
             onCollapse={onCollapse}
      >
        <div className={styles.logo}>
          <Link to={root_path}>
            <Icon type="rocket" style={{color:'green', fontSize:'32px'}} onClick={onLogoClick}/>
            <h1>{name}</h1>
          </Link>
        </div>
				<SiderMenuComp root_path={root_path} path={path} theme={theme} mode={mode} navData={navData}/>
      </Sider>
    );
});
