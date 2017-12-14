import React from "react";
import styles from "./index.less";

function resize(w, h, { minWidth, maxWidth, minHeight, maxHeight }) {
  if (!(w && h)) {
    // 如果没有指定w，h, 则先默认一半最大尺寸
    return [maxWidth / 2, maxHeight / 2];
  }

  if (w > maxWidth) {
    h = h * maxWidth / w;
    w = maxWidth;
  }
  if (h > maxHeight) {
    w = w * maxHeight / h;
    h = maxHeight;
  }
  if (w < minWidth) {
    h = h * minWidth / w;
    w = minWidth;
  }
  if (h < minHeight) {
    w = w * minHeight / h;
    h = minHeight;
  }

  return [w, h];
}

export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    const { msg } = props;
    const { w, h } = msg;
    this.state = {
      // 图片原始尺寸
      w,
      h
    };
  }

  onLoad = ({ target: img }) => {
    this.setState({
      w: img.naturalWidth,
      h: img.naturalHeight
    });
  };

  componentDidUpdate() {
    // re measure
    this.props.measure();
  }

  render() {
    const { w, h } = this.state;
    const { msg, width } = this.props;
    const { name, url } = msg;
    // const { width } = ctx;
    const maxWidth = width - 180;
    const sizeSpecs = { minWidth: 64, maxWidth, minHeight: 64, maxHeight: 300 };
    const [xw, xh] = resize(w, h, sizeSpecs);
    return (
      <div className={styles.main} style={sizeSpecs}>
        <img onLoad={this.onLoad} src={url} alt={name || url} style={{ width: xw, height: xh }} />
      </div>
    );
  }
}
