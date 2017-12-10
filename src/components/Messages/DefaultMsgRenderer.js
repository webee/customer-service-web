import { STRING_MSG_TYPE, UNKNOWN_MSG_TYPE } from "~/libs/MsgCodecs/DefaultMsgCodec";
import UnknownMsg from "./default/UnknownMsg";
import StringMsg from "./default/StringMsg";

export default class DefaultMsgRenderer {
  render({ type, msg }, ctx = {}) {
    if (type === STRING_MSG_TYPE) {
      return <StringMsg msg={msg} {...ctx} />;
    }
    try {
      const content = typeof msg === "string" ? msg : JSON.stringify(msg);
      return <UnknownMsg msg={content} {...ctx} />;
    } catch (err) {
      console.warn(err);
      return <UnknownMsg err={err} {...ctx} />;
    }
  }
}
