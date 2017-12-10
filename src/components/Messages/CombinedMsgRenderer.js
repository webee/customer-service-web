export default class CombinedMsgRenderer {
  constructor(...msgRenderers) {
    this.msgRenderers = msgRenderers;
  }

  render(...args) {
    for (const msgRenderer of this.msgRenderers) {
      try {
        const res = msgRenderer.render(...args);
        if (res) {
          return res;
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }
}
