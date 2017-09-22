import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import styles from './App.css';

function App({match}) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to dva!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
        <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
      </ul>
      <Route path='/xxx' render={() => (<h1>xxx</h1>)}/>
    </div>
  );
}

App.propTypes = {
};

export default connect()(App);
