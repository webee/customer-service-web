import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import styles from "./index.less";

export default class extends React.Component {
  state = {
    value: undefined
  };

  static contextTypes = {
    _container: PropTypes.object
  };

  _getContainer = () => {
    return this.context._container || document.body;
  };

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      if (!nextProps.value) {
        this.setState({ value: undefined });
      }
    }
  }

  render() {
    const { users, placeholder } = this.props;
    const { value } = this.state;
    return (
      <Select
        value={value}
        showSearch
        allowClear
        placeholder={placeholder}
        onChange={this.onChange}
        optionFilterProp="title"
        getPopupContainer={this._getContainer}
      >
        {users.map(user => (
          <Select.Option key={user.uid} title={user.name}>
            {user.name}
          </Select.Option>
        ))}
      </Select>
    );
  }

  onChange = value => {
    this.setState({ value });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };
}
