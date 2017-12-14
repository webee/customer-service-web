import * as xfilesService from "./xfiles";

export default class FileUploadCook {
  constructor(updateTxMsgCookingProgress, types: Set = new Set([])) {
    this.updateTxMsgCookingProgress = updateTxMsgCookingProgress;
    this.types = types;
  }

  addTypes(...types) {
    types.forEach(t => this.types.add(t));
  }
  onUploadTxProgress = (txMsg, ctx) => {
    return pe => {
      if (pe.lengthComputable) {
        const p = Math.round(pe.loaded * 100 / pe.total);
        this.updateTxMsgCookingProgress(ctx, txMsg, p);
      }
    };
  };

  async cook(txMsg, ctx) {
    const { type } = txMsg;
    if (this.types.has(type)) {
      const { state } = txMsg;
      const { fid } = await xfilesService.upload(state.file, this.onUploadTxProgress(txMsg, ctx));
      const msg = { ...txMsg.msg, url: `${xfilesService.baseURL}${fid}` };
      const msgType = "ripe";
      return { ...txMsg, msg, msgType };
    }
  }
}
