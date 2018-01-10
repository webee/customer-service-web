import React from "react";
import { Tooltip } from "antd";
import styles from "./index.less";

export default class extends React.PureComponent {
  state = {
    scrollWidth: 0,
    clientWidth: 0
  };

  get tip() {
    const { text, tipText } = this.props;
    const { scrollWidth, clientWidth } = this.state;
    console.debug(`EllipsisText: ${scrollWidth}/${clientWidth}`);
    return scrollWidth > clientWidth ? (tipText ? tipText : text) : undefined;
  }

  render() {
    const { text, width, ...props } = this.props;
    return (
      <Tooltip title={this.tip} {...{ mouseLeaveDelay: 0, ...props }}>
        <div ref={content => (this.content = content)} className={styles.main} style={{ width }}>
          {text}
        </div>
      </Tooltip>
    );
  }

  componentDidMount() {
    this._updateWidth();
  }

  componentDidUpdate() {
    this._updateWidth();
  }

  _updateWidth() {
    const { content } = this;
    if (content) {
      this.setState({ scrollWidth: content.scrollWidth, clientWidth: content.clientWidth });
    }
  }
}
