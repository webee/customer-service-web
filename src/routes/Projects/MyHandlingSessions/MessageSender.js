import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import { Button, Icon, Input } from "antd";
import Upload from "~/components/Upload";
import { dispatchDomainTypeEffect } from "../../../services/project";
import { getImageFileDimension } from "../../../utils/file";
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

  sendMsgs(msgs) {
    const { session, onSend } = this.props;
    // domain, type, msg, msgType
    for (let msg of msgs) {
      dispatchDomainTypeEffect(this.context, this.props, "_/sendMsg", {
        projectID: session.project_id,
        sessionID: session.id,
        ...msg
      });
    }
    onSend();
  }

  send = () => {
    const { session, onSend } = this.props;
    const { text } = this.state;
    if (!text) {
      // 不能发送空值
      return;
    }

    this.sendMsgs([
      {
        msgType: "ripe",
        domain: "",
        type: "text",
        msg: { text }
      }
    ]);
    this.setState({ text: "" });
  };

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.left}>
            <Upload multiple accept="image/*" onUpload={this.onUploadImages}>
              <Icon type="picture" />
            </Upload>
            <Upload multiple onUpload={this.onUploadFiles}>
              <Icon type="folder" />
            </Upload>
          </div>
          <div className={styles.right}>
            <Button type="primary" onClick={this.send}>
              发送
            </Button>
          </div>
        </div>
        <div className={styles.input}>
          <TextArea value={this.state.text} onChange={this.onChange} onKeyPress={this.onKeyPress} autoFocus={true} />
        </div>
      </div>
    );
  }

  onUploadImages = async (files, done) => {
    async function createImageMsgFromFile(file) {
      const { width: w, height: h } = await getImageFileDimension(file);
      return {
        msgType: "raw",
        domain: "",
        type: "image",
        msg: { name: file.name, size: file.size, url: URL.createObjectURL(file), w, h },
        state: { file }
      };
    }

    const promises = [];
    for (let f of files) {
      promises.push(createImageMsgFromFile(f));
    }

    const msgs = await Promise.all(promises);
    this.sendMsgs(msgs);
    done();
  };

  onUploadFiles = (files, done) => {
    const msgs = [];
    for (let f of files) {
      msgs.push({
        msgType: "raw",
        domain: "",
        type: "file",
        msg: { name: f.name, size: f.size, url: URL.createObjectURL(f) },
        state: { file: f }
      });
    }
    this.sendMsgs(msgs);
    done();
  };
}
