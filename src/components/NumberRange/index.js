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
        console.log("value: ", nextProps.value);
        this.setState({ start: undefined, end: undefined });
      }
    }
  }

  render() {
    const { start, end } = this.state;
    return (
      <div className={styles.main}>
        <InputNumber className={styles.start} value={start} onChange={this.onStartChange} placeholder="最小值" />
        <InputNumber className={styles.end} value={end} onChange={this.onEndChange} placeholder="最大值" />
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
    let start = this.transformerValue(val);
    const { start: prevStart, end } = this.state;
    if (end !== undefined && start > end) {
      start = end;
    }
    this.setState({ start }, this.triggerChange);
  };

  onEndChange = val => {
    let end = this.transformerValue(val);
    let { start, end: prevEnd } = this.state;
    if (start !== undefined && end < start) {
      end = prevEnd === undefined ? start : undefined;
    }
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
