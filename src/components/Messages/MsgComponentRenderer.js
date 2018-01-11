import React from "react";

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
      return <MsgComp msg={msg} {...ctx} />;
    }
  }
}
