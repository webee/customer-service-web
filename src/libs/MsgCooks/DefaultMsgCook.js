export default class DefaultMsgCook {
  async cook(txMsg) {
    throw new Error(`failed to cook tx msg: ${txMsg}`);
  }
}
