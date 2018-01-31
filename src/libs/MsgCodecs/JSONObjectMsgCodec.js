export default class JSONObjectMsgCodec {
  constructor(types) {
    this.types = types;
  }

  addTypes(...types) {
    types.forEach(t => this.types.add(t));
  }

  encode({ type, msg }) {
    if (this.types.has(type)) {
      try {
        return { type, content: JSON.stringify(msg) };
      } catch (err) {
        console.warn(err);
      }
    }
  }

  decode({ type, content }) {
    if (this.types.has(type)) {
      try {
        const msg = JSON.parse(content);
        if (typeof msg !== "object") {
          throw new Error("bad json object msg format");
        }
        return { type, msg };
      } catch (err) {
        console.warn(err);
      }
    }
  }
}
