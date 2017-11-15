import { withRouter, Link } from 'dva/router';
import { Breadcrumb } from 'antd';
import styles from './index.css';


export default ({root_path, path, urlNameMap}) => {
  console.debug('Breadcrumb: ', {root_path, path, urlNameMap});

  const pathSnippets = path.substr(root_path.length).split('/').filter(i => i);
  const urls = pathSnippets.map((_, index) => {
    return `${root_path}/${pathSnippets.slice(0, index + 1).join('/')}`;
  });

  if (urlNameMap.hasOwnProperty(root_path)) {
    urls.unshift(root_path);
  }

  const breadcrumbItems = urls.map((url, index) => {
    let item = urlNameMap[url] || {name:'_'};
    if (typeof item === 'string') {
      item = {name: item};
    }
    let link = item.name;
    if (!item.noLink && index < urls.length -1 ) {
      link = (<Link to={url}>{item.name}</Link>);
    }
    return (
      <Breadcrumb.Item key={url}>
        {link}
      </Breadcrumb.Item>
    );
  });
  return (
    <Breadcrumb className={styles.normal}>
      {breadcrumbItems}
    </Breadcrumb>
  );
};
