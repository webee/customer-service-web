import { STRING_MSG_TYPE, UNKNOWN_MSG_TYPE } from "~/libs/MsgCodecs/DefaultMsgCodec";
import UnknownMsg from "./default/UnknownMsg";
import StringMsg from "./default/StringMsg";

export default class DefaultMsgRenderer {
  render({ type, msg }) {
    if (type === STRING_MSG_TYPE) {
      return <StringMsg msg={msg} />;
    }
    return <UnknownMsg msg={msg} />;
  }
}
