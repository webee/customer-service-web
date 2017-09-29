import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './index.less';

import SessionListView from './SessionList';
import SessionDetailView from './SessionDetail';


class View extends Component {
  state = {
  };

  componentDidMount() {
    console.debug('my handling sessions did mount');
    const { dispatch } = this.props;
    const { projectDomain, projectType } = this.props;
    dispatch({type: 'project/myHandlingFetchSessions', payload: {project_domain: projectDomain, project_type: projectType}});
  }

  render() {
    const {myHandling} = this.props;
    return (
			<Row className={styles.main}>
				<Col span={4} className={styles.list}>
          <SessionListView sessions={myHandling.sessions}/>
        </Col>
				<Col span={20} className={styles.detail}>
          <SessionDetailView myHandling={myHandling}/>
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
