export default class MsgRenderer {
  constructor(typeComponents) {
    this.typeComponents = typeComponents;
  }

  addTypeComponents(typeComponents) {
    this.typeComponents = { ...this.typeComponents, ...typeComponents };
  }

  render({ type, msg }) {
    if (this.typeComponents.hasOwnProperty(type)) {
      const MsgComp = this.typeComponents[type];
      return <MsgComp msg={msg} />;
    }
  }
}
