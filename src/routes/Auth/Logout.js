import React from "react";
import Loader from "~/components/Loader";
import { connect } from "dva";

@connect()
export default class Logout extends React.PureComponent {
  componentDidMount() {
    const { dispatch, location } = this.props;
    console.debug("Logout: ", location);
    dispatch({ type: "auth/logout", payload: location.state });
  }

  render() {
    return <Loader />;
  }
}
