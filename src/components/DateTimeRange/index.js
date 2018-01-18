import React from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default class extends React.Component {
  state = {
    value: []
  };

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      if (!nextProps.value) {
        this.setState({ value: [] });
      }
    }
  }

  render() {
    const { ranges } = this.props;
    const { value } = this.state;
    return (
      <RangePicker
        ranges={ranges}
        value={value}
        showTime={{ format: "HH:mm" }}
        format="YYYY-MM-DD HH:mm"
        onChange={this.onChange}
      />
    );
  }

  onChange = dates => {
    this.setState({ value: dates });
    const { onChange } = this.props;
    if (onChange) {
      if (dates.length === 2) {
        onChange(dates.map(d => d.unix()).join(","));
      } else {
        onChange(undefined);
      }
    }
  };
}
