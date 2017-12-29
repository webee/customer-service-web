import React from "react";
import { Tooltip } from "antd";
import styles from "./index.less";

export default class extends React.Component {
  get tip() {
    const { text, tipText } = this.props;
    const { content } = this;
    return content && content.scrollWidth > content.clientWidth ? (tipText ? tipText : text) : undefined;
  }

  render() {
    const { text, width } = this.props;
    return (
      <Tooltip title={this.tip}>
        <div ref={content => (this.content = content)} className={styles.main} style={{ width }}>
          {text}
        </div>
      </Tooltip>
    );
  }

  componentDidMount() {}
}
