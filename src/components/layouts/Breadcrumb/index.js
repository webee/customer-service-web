import React from "react";
import { Link } from "dva/router";
import { Breadcrumb } from "antd";
import styles from "./index.less";

export default class extends React.PureComponent {
  render() {
    const { root_path, path, urlDataMap } = this.props;
    console.debug("Breadcrumb: ", { root_path, path, urlDataMap });

    const pathSnippets = path
      .substr(root_path.length)
      .split("/")
      .filter(i => i);
    const urls = pathSnippets.map((_, index) => {
      return `${root_path}/${pathSnippets.slice(0, index + 1).join("/")}`;
    });

    if (urlDataMap.hasOwnProperty(root_path)) {
      urls.unshift(root_path);
    }

    const breadcrumbItems = urls.map((url, index) => {
      const item = urlDataMap[url] || { title: "_" };
      let link = item.title;
      if (!item.noLink && index < urls.length - 1) {
        link = <Link to={url}>{item.title}</Link>;
      }
      return <Breadcrumb.Item key={url}>{link}</Breadcrumb.Item>;
    });
    return <Breadcrumb className={styles.main}>{breadcrumbItems}</Breadcrumb>;
  }
}
