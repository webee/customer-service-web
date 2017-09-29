import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import styles from './index.less';


class View extends Component {
  state = {
  };

  componentDidMount() {
  }

  render() {
    return (
      <h1>Content</h1>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(View);
