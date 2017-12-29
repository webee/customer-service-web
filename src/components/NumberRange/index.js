import React from "react";
import { InputNumber } from "antd";
import styles from "./index.less";

function identityTransformer(v) {
  return v;
}

export default class extends React.Component {
  state = {
    start: undefined,
    end: undefined
  };

  get transformer() {
    return this.props.transformer || identityTransformer;
  }

  get minMax() {
    let { min, max } = this.props;
    min = min === undefined ? -Infinity : min;
    max = max === undefined ? Infinity : max;
    if (min > max) {
      max = min;
    }
    return { min, max };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      if (!nextProps.value) {
        this.setState({ start: undefined, end: undefined });
      }
    }
  }

  render() {
    const { start, end } = this.state;
    return (
      <div className={styles.main}>
        <InputNumber className={styles.start} value={start} onChange={this.onStartChange} />
        <InputNumber className={styles.end} value={end} onChange={this.onEndChange} />
      </div>
    );
  }

  transformerValue(val) {
    val = parseFloat(val);
    if (isNaN(val)) {
      val = undefined;
    } else {
      val = this.transformer(val);
      const { min, max } = this.minMax;
      if (val < min) {
        val = min;
      }
      if (val > max) {
        val = max;
      }
    }
    return val;
  }

  onStartChange = val => {
    const start = this.transformerValue(val);
    this.setState({ start }, this.triggerChange);
  };

  onEndChange = val => {
    const end = this.transformerValue(val);
    this.setState({ end }, this.triggerChange);
  };

  triggerChange = () => {
    const onChange = this.props.onChange;
    if (onChange) {
      const { start, end } = this.state;
      if (start === undefined && end === undefined) {
        onChange(undefined);
      } else if (start > end) {
        onChange(undefined);
      } else {
        onChange([start, end].join(","));
      }
    }
  };
}
