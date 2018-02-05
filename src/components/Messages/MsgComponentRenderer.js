import React from "react";
import ErrorMsg from "./default/ErrorMsg";

class MsgComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    const { type, msg, ctx } = this.props;

    if (this.state.error) {
      const content = typeof msg === "string" ? msg : JSON.stringify(msg);
      return <ErrorMsg type={type} content={content} {...ctx} />;
    }

    const { Comp } = this.props;
    return <Comp msg={msg} {...ctx} />;
  }
}

export default class MsgComponentRenderer {
  constructor(typeComponents) {
    this.typeComponents = typeComponents;
  }

  addTypeComponents(typeComponents) {
    this.typeComponents = { ...this.typeComponents, ...typeComponents };
  }

  render({ type, msg }, ctx = {}) {
    if (this.typeComponents[type] !== undefined) {
      const MsgComp = this.typeComponents[type];
      return <MsgComponent Comp={MsgComp} type={type} msg={msg} ctx={ctx} />;
    }
  }
}
