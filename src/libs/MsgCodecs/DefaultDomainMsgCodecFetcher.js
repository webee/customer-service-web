import CombinedMsgCodec from "./CombinedMsgCodec";
import DefaultMsgCodec from "./DefaultMsgCodec";

export default class DefaultDomainMsgCodecFetcher {
  defaultMsgCodec = new DefaultMsgCodec();
  domainMsgCodecs = {};

  get(domain) {
    const msgCodec = this.domainMsgCodecs[domain];
    if (!msgCodec) {
      return this.defaultMsgCodec;
    }
    return msgCodec;
  }

  register(domain, ...msgCodecs) {
    let domains = [];
    if (Array.isArray(domain)) {
      domains = domain;
    } else {
      domain.push(domain);
    }

    domains.forEach(d => {
      this.domainMsgCodecs[d] = new CombinedMsgCodec(...[...msgCodecs].reverse(), this.get(d));
    });
  }
}
