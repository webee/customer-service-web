import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './index.less';


class View extends Component {
  state = {
  };

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={4} className={styles.list}>会话列表</Col>
          <Col span={20} className={styles.detail}>对话详情</Col>
        </Row>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(View);
