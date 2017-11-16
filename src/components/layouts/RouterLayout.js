import React, { Component } from 'react';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import { withRouter } from 'dva/router';
import { getRootPath, Routes } from '../../commons/router';
import { getURLDataMapFromNavData } from '../../commons/nav';
import NotFound from '../NotFound';


@withRouter
export default class RouterLayout extends React.Component {
  render() {
    const { match, location, name, navData } = this.props;
    console.debug('navData: ', navData);
    const root_path = getRootPath(match.path);
    const path = location.pathname.replace(/\/*$/,'') || '/';
    const urlDataMap = getURLDataMapFromNavData(root_path, navData);
    console.debug('urlDataMap: ', urlDataMap);
    const urlData = urlDataMap[path === '/' ? '' : path] || {};

    // title
    let title = name;
    if (urlData) {
      title = `${urlData.title} - ${name}`;
    }
    return (
      <DocumentTitle title={title}>
          <Routes path={root_path} navData={navData} NoMatch={NotFound} />
      </DocumentTitle>
    );
  }
}
