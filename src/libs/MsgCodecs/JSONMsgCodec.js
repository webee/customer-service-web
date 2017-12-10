export default class JSONMsgCodec {
  constructor(types: Set) {
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
        console.error(err);
      }
    }
  }

  decode({ type, content }) {
    if (this.types.has(type)) {
      try {
        return { type, msg: JSON.parse(content) };
      } catch (err) {
        console.error(err);
      }
    }
  }
}