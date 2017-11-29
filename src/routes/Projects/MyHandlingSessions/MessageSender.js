import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import { Icon, Input } from "antd";
import { dispatchDomainTypeEffect } from "../../../services/project";
import styles from "./MessageSender.less";

const { TextArea } = Input;

export default class extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  state = {
    value: ""
  };

  onChange = e => {
    this.setState({ value: e.target.value });
  };

  onKeyPress = e => {
    const { session } = this.props;
    console.log("key: ", e.key);
    console.log("keyCode: ", e.nativeEvent.keyCode);
    console.log("shiftKey: ", e.nativeEvent.shiftKey);
    console.log("ctrlKey: ", e.nativeEvent.ctrlKey);
    const { value } = this.state;
    if (e.key === "Enter") {
      if (!value) {
        e.preventDefault();
      } else {
        e.preventDefault();
        // send msg
        dispatchDomainTypeEffect(this.context, this.props, "myHandling/sendSessionMsg", {
          projectID: session.project_id,
          sessionID: session.id,
          domain: "",
          type: "text",
          content: JSON.stringify({ text: this.state.value })
        });
        this.setState({ value: "" });
      }
    }
  };

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.toolbar}>
          <Icon type="picture" />
          <Icon type="folder" />
        </div>
        <div className={styles.input}>
          <TextArea
            value={this.state.value}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
            onKeyUp={this.onKeyUp}
          />
        </div>
      </div>
    );
  }
}
