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

function genMenuItems(items) {
  return items.map((item) => item.items ? (
      <SubMenu key={item.key} title={<span>{item.icon?<Icon type={item.icon}/>:''}<span>{item.title}</span></span>}>
        {genMenuItems(item.items)}
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


export const SiderMenuComp = withRouter(({match, location, menuConfigs}) => {
  const { theme, mode, items } = menuConfigs;
  const itemConfigs = genMenuItemConfigs(match.path, items);
  const pathname = location.pathname.replace(/\/*$/,'') || '/';
  const openKeys = findOpenKeys(pathname, itemConfigs);
  const selectedKeys = [pathname];
  console.debug('itemConfigs', itemConfigs);
  console.debug('openKeys', openKeys);
  console.debug('selectedKeys', selectedKeys);

  return (
    <Menu theme={theme||'dark'} defaultSelectedKeys={selectedKeys} selectedKeys={selectedKeys} defaultOpenKeys={openKeys} mode={mode}>
      {genMenuItems(itemConfigs)}
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
				<SiderMenuComp className={styles.menu} menuConfigs={menuConfigs}/>
      </Sider>
    )}</Media>
  );
});
