export default class CombinedMsgCook {
  constructor(...msgCooks) {
    this.msgCooks = msgCooks;
  }

  async cook(txMsg, ctx={}) {
    for (const msgCook of this.msgCooks) {
      try {
        const cookedMsg = await msgCook.cook(txMsg, ctx);
        if (cookedMsg) {
          return cookedMsg;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}
