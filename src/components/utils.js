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

export function newlineToTarget(text, target = " ", newline = "\n") {
  const res = [];
  let curIdx = 0;
  let idx = -1;
  while ((idx = text.indexOf(newline, curIdx)) >= 0) {
    if (idx > curIdx) {
      res.push(text.substring(curIdx, idx));
    }
    res.push(target);
    curIdx = idx + 1;
  }
  if (curIdx < text.length) {
    res.push(text.substring(curIdx));
  }
  return res;
}
