import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import { Button, Icon, Input } from "antd";
import { dispatchDomainTypeEffect } from "../../../services/project";
import styles from "./MessageSender.less";

const { TextArea } = Input;

export default class extends React.Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  state = {
    text: ""
  };

  onChange = e => {
    this.setState({ text: e.target.value });
  };

  onKeyPress = e => {
    if (e.charCode === 13) {
      // enter
      if (e.shiftKey || e.ctrlKey) {
        // (shift|ctrl)-enter: send
        this.send();
        e.preventDefault();
      } else {
        const { text } = this.state;
        if (!text) {
          e.preventDefault();
        }
      }
    }
  };

  send = () => {
    const { session, onSend } = this.props;
    const { text } = this.state;
    if (!text) {
      // 不能发送空值
      return;
    }

    // send msg
    dispatchDomainTypeEffect(this.context, this.props, "_/sendMsg", {
      projectID: session.project_id,
      sessionID: session.id,
      domain: "",
      type: "text",
      content: JSON.stringify({ text }),
      msgType: "ripe"
    });
    // dispatchDomainTypeEffect(this.context, this.props, "myHandling/sendSessionMsg", {
    //   projectID: session.project_id,
    //   sessionID: session.id,
    //   domain: "",
    //   type: "text",
    //   content: JSON.stringify({ text })
    // });
    onSend();
    this.setState({ text: "" });
  };

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.left}>
            <Icon type="picture" />
            <Icon type="folder" />
          </div>
          <div className={styles.right}>
            <Button type="primary" onClick={this.send}>
              发送
            </Button>
          </div>
        </div>
        <div className={styles.input}>
          <TextArea value={this.state.text} onChange={this.onChange} onKeyPress={this.onKeyPress} />
        </div>
      </div>
    );
  }
}
