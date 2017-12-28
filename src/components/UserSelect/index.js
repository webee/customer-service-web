import React from "react";
import { Select } from "antd";
import styles from "./index.less";

export default class extends React.Component {
  render() {
    const { users } = this.props;
    return (
      <Select showSearch onChange={this.onChange} optionFilterProp="title">
        {users.map(user => (
          <Select.Option key={user.uid} title={user.name}>
            {user.name}
          </Select.Option>
        ))}
      </Select>
    );
  }

  onChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };
}
