import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import {dispatchDomainTypeEffect} from '~/services/project';
import styles from './index.less';

import SessionListView from './SessionList';
import SessionDetailView from './SessionDetail';


class View extends Component {
  state = {
  };

  componentDidMount() {
    console.debug('my handling sessions did mount');
    dispatchDomainTypeEffect(this.props, 'myHandling/fetchSessions');
  }

  render() {
    const {projectDomain, projectType} = this.props;
    const {myHandling} = this.props;
    return (
			<Row className={styles.main}>
				<Col span={4} className={styles.list}>
          <SessionListView projectDomain={projectDomain} projectType={projectType} myHandling={myHandling}/>
        </Col>
				<Col span={20} className={styles.detail}>
          <SessionDetailView projectDomain={projectDomain} projectType={projectType} myHandling={myHandling}/>
        </Col>
			</Row>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const {projectDomain, projectType} = ownProps;
  const typeState = state.project[[projectDomain, projectType]];
  return {
    myHandling: typeState.myHandling
  };
}

export default connect(mapStateToProps)(View);
