export default class CombinedMsgCodec {
  constructor(...msgCodecs) {
    this.msgCodecs = msgCodecs;
  }

  encode(msg) {
    for (const msgCodec of this.msgCodecs) {
      try {
        const encodedMsg = msgCodec.encode(msg);
        if (encodedMsg) {
          return encodedMsg;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  decode(msg) {
    for (const msgCodec of this.msgCodecs) {
      try {
        const decodedMsg = msgCodec.decode(msg);
        if (decodedMsg) {
          return decodedMsg;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}
