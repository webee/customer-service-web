import React from 'react';
import Loader from 'react-loader';
import { connect } from 'dva';



@connect()
export default class Logout extends React.PureComponent {
  componentDidMount() {
    const { dispatch, location } = this.props;
    console.log('Logout: ', location);
    dispatch({type: 'auth/logout', payload: location.state});
  }

  render() {
    return <Loader loaded={false}/>;
  }
}
