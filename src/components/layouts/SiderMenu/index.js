import { withRouter, Link } from 'dva/router';
import { Menu, Icon, Layout } from 'antd';
const { Sider } = Layout;
import MediaQuery from 'react-responsive';
import Media from 'react-media';
import { genMenuDataFromNavData } from '../../../commons/nav';
import styles from './index.less';

const {SubMenu, ItemGroup} = Menu;


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
      if (path === item.path) {
        selectedKey = item.path;
      } else if (item.items) {
        selectedKey = findSelectedKey(path, item.items);
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


export const SiderMenuComp = ({collapsed, root_path, path, theme, mode, menuData}) => {
  const openKeys = findOpenKeys(path, menuData);
  const selectedKeys = [findSelectedKey(path, menuData)];
  console.debug('path', path);
  console.debug('menuData', menuData);
  console.debug('openKeys', openKeys);
  console.debug('selectedKeys', selectedKeys);

  // TODO: 解决弹出菜单hidden的问题,
  //      目前在collapsed的时候不处理overflow, 大部分情况可以处理
  const style = {};
  if (!collapsed) {
    style['overflow'] = "auto";
  }
  return (
    <Menu className={styles.menu} style={style}
      theme={theme} selectedKeys={selectedKeys} defaultOpenKeys={openKeys} mode={mode}>
      {genMenuItems(menuData)}
		</Menu>
  );
};


const noOp = () => {};

export default ({root_path, path, name, collapsed, onCollapse, theme, mode, menuData, onLogoClick=noOp, withTrigger=false}) => {
  return (
      <Sider className={styles.sider}
             collapsible
             breakpoint="lg"
             trigger={withTrigger ? undefined : null}
             collapsed={collapsed}
             onCollapse={onCollapse}
      >
        <div className={styles.logo}>
          <Link to={root_path}>
            <Icon type="rocket" style={{color:'green', fontSize:'32px'}} onClick={onLogoClick}/>
            <h1>{name}</h1>
          </Link>
        </div>
				<SiderMenuComp {...{ collapsed, root_path, path, theme, mode, menuData }}/>
      </Sider>
    );
};
