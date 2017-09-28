import { withRouter, Link } from 'dva/router';
import { Menu, Icon, Layout } from 'antd';
const { Sider } = Layout;
import MediaQuery from 'react-responsive';
import Media from 'react-media';
const {SubMenu, ItemGroup} = Menu;
import styles from './index.less';


/*
{key, icon, title, pathname, [items]}
 */
function genMenuItemConfigs(path, items) {
  return items.map((item, _) => {
    let {icon, title, pathname, open, items} = item;
    if (!pathname.startsWith('/')) {
      if (path.endsWith('/')) {
        pathname = pathname ? `${path}${pathname}`: path;
      } else {
        pathname = pathname ? `${path}/${pathname}`: path;
      }
    }

    const new_item = {key: pathname, icon, title, pathname, open};
    if (item.items) {
      new_item['items'] = genMenuItemConfigs(pathname, item.items);
    }
    return new_item;
  });
}

function findOpenKeys(path, items) {
  const openKeys = [];
  for (let i in items) {
    const item = items[i];
    if (item.items && (item.open || path.startsWith(item.pathname))) {
      openKeys.push(item.key);
      openKeys.push(...findOpenKeys(path, item.items));
    }
  }
  return openKeys;
}

function findSelectedKeys(root_path, path, items) {
  const selectedKeys = [];
  for (let i in items) {
    const item = items[i];
    if ((root_path != item.pathname && path.startsWith(item.pathname)) || path == item.pathname) {
      // 除非path == root_path, 否则过滤掉root_path
      selectedKeys.push(item.key);
    }
    if (item.items) {
      selectedKeys.push(...findSelectedKeys(root_path, path, item.items));
    }
  }
  return selectedKeys;
}

function genMenuItems(collapsed, items) {
  return items.map((item) => item.items ? (
      <SubMenu key={item.key} title={
      collapsed ?
        <Link to={item.pathname}>
          {item.icon ? <Icon type={item.icon} /> : ''}
          <span>{item.title}</span>
        </Link>:
        <span>{item.icon?<Icon type={item.icon}/>:''}<span>{item.title}</span></span>
      }>
        {genMenuItems(collapsed, item.items)}
      </SubMenu>
  ) : (
      <Menu.Item key={item.key}>
        <Link to={item.pathname}>
          {item.icon ? <Icon type={item.icon} /> : ''}
          <span>{item.title}</span>
        </Link>
      </Menu.Item>
  )
  );
}


export const SiderMenuComp = withRouter(({match, location, collapsed, menuConfigs}) => {
  const { theme, mode, items } = menuConfigs;
  const root_path = match.path;
  const itemConfigs = genMenuItemConfigs(root_path, items);
  const pathname = location.pathname.replace(/\/*$/,'') || '/';
  const openKeys = findOpenKeys(pathname, itemConfigs);
  const selectedKeys = [pathname];
  //const selectedKeys = findSelectedKeys(root_path, pathname, itemConfigs);
  console.debug('pathname', pathname);
  console.debug('itemConfigs', itemConfigs);
  console.debug('openKeys', openKeys);
  console.debug('selectedKeys', selectedKeys);

  return (
    <Menu theme={theme||'dark'} defaultSelectedKeys={selectedKeys} selectedKeys={selectedKeys} defaultOpenKeys={openKeys} mode={mode}>
      {genMenuItems(false, itemConfigs)}
		</Menu>
  );
});


const noOp = () => {};

export default withRouter(({app_name, match, collapsed, onCollapse, menuConfigs, onLogoClick=noOp}) => {
  return (
    // 992px
    <Media query="(max-width: 768px)">{matches => (
      <Sider className={styles.sider}
             collapsible
             breakpoint="lg"
             collapsedWidth={matches ? 0:64}
             trigger={matches ? null:undefined}
             collapsed={collapsed}
             onCollapse={onCollapse}
      >
        <div className={styles.logo}>
          <Link to={`${match.path}`} style={{textDecoration: null}}>
            <Icon type="rocket" style={{color:'green', fontSize:'32px'}} onClick={onLogoClick}/>
            {!collapsed?<span>{app_name}</span>:''}
          </Link>
        </div>
				<SiderMenuComp className={styles.menu} collapsed={collapsed} menuConfigs={menuConfigs}/>
      </Sider>
    )}</Media>
  );
});
