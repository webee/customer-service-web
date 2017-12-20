
export function getURLDataMapFromNavData(root_path, navItems) {
  let urlNameMap = {};
  navItems.forEach(item => {
    const path = item.pathname ? `${root_path}/${item.pathname}` : root_path;
    urlNameMap[path] = { ...item, items: undefined, instance: undefined }
    if (item.instance) {
      urlNameMap = { ...urlNameMap, ...getURLDataMapFromNavData(path, item.instance.items)}
    }
    if (item.items) {
      urlNameMap = { ...urlNameMap, ...getURLDataMapFromNavData(path, item.items)}
    }
  });
  return urlNameMap;
}

export function getMenuDataFromNavData(root_path, navItems) {
  const menuData = [];
  navItems.forEach(item => {
    const {icon, title, pathname, open, items} = item;
    const path = pathname ? `${root_path}/${pathname}`: (root_path || '/');

    if (item.instance) {
      menuData.push(...getMenuDataFromNavData(path, item.instance.items));
    } else {
      const menuDataItem = {key: path, icon, title, path, open};
      menuData.push(menuDataItem);
      if (item.items) {
        menuDataItem['items'] = getMenuDataFromNavData(path, item.items);
      }
    }
  });
  return menuData;
}
