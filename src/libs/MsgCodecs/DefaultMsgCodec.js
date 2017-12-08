export const STRING_MSG_TYPE = "__STRING__";
export const UNKNOWN_MSG_TYPE = "__UNKNOWN__";

export default class DefaultMsgCodec {
  encode({ msg }) {
    if (typeof msg === "string") {
      return { msg };
    }
    try {
      return { type: UNKNOWN_MSG_TYPE, content: JSON.stringify(msg) };
    } catch (err) {
      console.error(err);
    }
    return { type: UNKNOWN_MSG_TYPE };
  }

  decode({ type, content }) {
    if (type === UNKNOWN_MSG_TYPE) {
      try {
        return { type, msg: content };
      } catch (err) {
        console.error(err);
      }
      return { type };
    }

    return { type: STRING_MSG_TYPE, msg: content };
  }
}
