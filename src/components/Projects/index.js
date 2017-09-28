import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.css';


class Projects extends Component {
  componentDidMount() {
    console.log('projects did mount');
  }

  render() {
    const {match} = this.props;
    const {params} = match;
    return (
      <h1>Projects of: {params.projectDomain}/{params.projectType}</h1>
    );
  }
}



function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Projects);
