import React from 'react';
import Loader from 'react-loader';
import { connect } from 'dva';



@connect()
export default class Logout extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch({type: 'auth/logout', payload: '/auth'});
  }

  render() {
    return <Loader loaded={false}/>;
  }
}
