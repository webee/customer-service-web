export default class CombinedMsgRenderer {
  constructor(...msgRenderers) {
    this.msgRenderers = msgRenderers;
  }

  render(msg) {
    for (const msgRenderer of this.msgRenderers) {
      try {
        const res = msgRenderer.render(msg);
        if (res) {
          return res;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}
