export function getURLDataMapFromNavData(root_path, navItems) {
  let urlNameMap = {};
  navItems.forEach(item => {
    const { pathname, items, instance } = item;
    const path = pathname ? `${root_path}/${pathname}` : root_path;
    urlNameMap[path] = { ...item, items: undefined, instance: undefined };
    if (items && items.length > 0) {
      urlNameMap = { ...urlNameMap, ...getURLDataMapFromNavData(path, items) };
    }
    if (instance && instance.items && instance.items.length > 0) {
      urlNameMap = {
        ...urlNameMap,
        ...getURLDataMapFromNavData(path, instance.items.map(item => ({ ...instance, ...item, items: undefined })))
      };
    }
  });
  return urlNameMap;
}

export function getMenuDataFromNavData(root_path, navItems) {
  const menuData = [];
  navItems.forEach(item => {
    const { icon, title, pathname, open, instance, items } = item;
    const path = pathname ? `${root_path}/${pathname}` : root_path || "/";

    const menuDataItems = [];
    if (instance && !instance.noMenu && instance.items && instance.items.length > 0) {
      menuDataItems.push(...getMenuDataFromNavData(path, instance.items));
    }
    if (items && items.length > 0) {
      menuDataItems.push(...getMenuDataFromNavData(path, items));
    }

    const menuDataItem = { key: path, icon, title, path, open };
    if (menuDataItems.length > 0) {
      menuDataItem["items"] = menuDataItems;
    }
    menuData.push(menuDataItem);
  });
  return menuData;
}
