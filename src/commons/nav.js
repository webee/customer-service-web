
export function getURLDataMapFromNavData(root_path, navData) {
  let urlNameMap = {};
  navData.forEach(item => {
    const path = item.pathname ? `${root_path}/${item.pathname}` : root_path;
    urlNameMap[path] = { ...item, items: undefined }
    if (item.items) {
      urlNameMap = { ...urlNameMap, ...getURLDataMapFromNavData(path, item.items)}
    }
  });
  return urlNameMap;
}

export function getMenuDataFromNavData(root_path, navData) {
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
      menuDataItem['items'] = getMenuDataFromNavData(path, item.items);
    }
    return menuDataItem;
  });
}
