import React from 'react';
import { connect } from 'dva';
import styles from './_TestApp.css';
import MainLayout from './_test/MainLayout';


function App() {
  return (
    <div className={styles.normal}>
      <MainLayout />
    </div>
  );
}

App.propTypes = {
};

export default connect()(App);


export const urlNameMap = {
  '/_': '首页',
  '/_/general': '普通组件',
  '/_/general/button': '按钮',
  '/_/general/icon': '图标',
  '/_/layout': '布局组件',
  '/_/layout/grid': '栅格',
  '/_/layout/layout': '布局',
};
