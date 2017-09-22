import { withRouter, Link } from 'dva/router';
import { Breadcrumb } from 'antd';
import styles from './index.css';


export default withRouter(({location, urlNameMap}) => {
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const urls = pathSnippets.map((_, index) => {
    return `/${pathSnippets.slice(0, index + 1).join('/')}`;
  });
  if (urlNameMap.hasOwnProperty('/')) {
    urls.unshift('/');
  }

  const breadcrumbItems = urls.map((url, index) => {
    const name = urlNameMap[url] || '_';
    let link = name;
    if (index < urls.length -1 ) {
      link = (<Link to={url}>{name}</Link>);
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
});
