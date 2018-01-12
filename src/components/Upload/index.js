import React from "react";
import styles from "./index.less";

export default class extends React.PureComponent {
  onChange = ({ target }) => {
    const { files } = target;
    this.props.onUpload(files, () => (target.value = null));
  };

  render() {
    const { children, onUpload, ...props } = this.props;
    return (
      <div className={styles.main}>
        <input onChange={this.onChange} {...props} type="file" />
        {children}
      </div>
    );
  }
}
