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
      h,
      error: false
    };
  }

  onLoad = ({ target: img }) => {
    this.setState({
      w: img.naturalWidth,
      h: img.naturalHeight
    });
  };

  onError = () => {
    this.setState({ error: true });
  };

  componentDidUpdate() {
    // re measure
    const { measure } = this.props;
    if (measure) {
      measure();
    }
  }

  get alt() {
    if (this.state.error) {
      return "图像加载失败!!";
    }
    const { name, url } = this.props.msg;
    return name || url;
  }

  render() {
    const { msg, width, as_description } = this.props;
    if (as_description) {
      return this.renderDescription();
    }

    const { w, h } = this.state;
    const { name, url } = msg;
    // const { width } = ctx;
    const maxWidth = width - 180;
    const sizeSpecs = { minWidth: 64, maxWidth, minHeight: 64, maxHeight: 300 };
    const [xw, xh] = resize(w, h, sizeSpecs);
    const errorStyle = this.state.error ? { backgroundColor: "pink" } : {};
    return (
      <div className={styles.main} style={sizeSpecs}>
        <img
          onLoad={this.onLoad}
          onError={this.onError}
          src={url}
          alt={this.alt}
          style={{ width: xw, height: xh, ...errorStyle }}
        />
      </div>
    );
  }

  renderDescription() {
    const { msg: { name, url } } = this.props;
    return `[图片] ${name || url}`;
  }
}
