export default class JSONMsgCodec {
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
        return { type, msg: JSON.parse(content) };
      } catch (err) {
        console.warn(err);
      }
    }
  }
}
