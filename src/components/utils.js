import React from "react";
import PropTypes from "prop-types";

export function withContainerContext(Comp, getContainerProp = "getPopupContainer") {
  return class extends React.Component {
    static contextTypes = {
      _container: PropTypes.object
    };

    _getContainer = () => {
      return this.context._container || document.body;
    };

    render() {
      const getContainerProps = { [getContainerProp]: this._getContainer };
      return <Comp {...getContainerProps} {...this.props} />;
    }
  };
}
