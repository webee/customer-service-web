import { withRouter, Link } from 'dva/router';
import { Menu, Icon } from 'antd';
const {SubMenu, ItemGroup} = Menu;
import styles from './index.css';


/*
{key, icon, title, pathname, [items]}
 */
function genMenuItemConfigs(path, items) {
  return items.map((item, _) => {
    let {icon, title, pathname, items} = item;
    if (!pathname.startsWith('/')) {
      pathname = pathname ? `${path}/${pathname}`: path;
    }

    const new_item = {key: pathname, icon, title, pathname};
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
    if (item.items && path.startsWith(item.pathname)) {
      openKeys.push(item.key);
      openKeys.push(...findOpenKeys(path, item.items));
    }
  }
  return openKeys;
}

function genMenuItems(items) {
  return items.map((item) => item.items ? (
      <SubMenu key={item.key} title={<span>{item.icon?<Icon type="appstore"/>:''}<span>{item.title}</span></span>}>
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


export default withRouter(({match, location, menuConfigs}) => {
  const { theme, mode, items } = menuConfigs;
  const itemConfigs = genMenuItemConfigs(match.path, items);
  const pathname = location.pathname.replace(/\/*$/,'');
  const openKeys = findOpenKeys(pathname, itemConfigs);
  const selectedKeys = [pathname];

  return (
    <Menu theme={theme||'dark'} defaultSelectedKeys={selectedKeys} selectedKeys={selectedKeys} defaultOpenKeys={openKeys} mode={mode}>
      {genMenuItems(itemConfigs)}
		</Menu>
  );
});
