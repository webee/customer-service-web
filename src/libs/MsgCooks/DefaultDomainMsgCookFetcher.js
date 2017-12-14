import CombinedMsgCook from "./CombinedMsgCook";
import DefaultMsgCook from "./DefaultMsgCook";

export default class DefaultDomainMsgCookFetcher {
  defaultMsgCook = new DefaultMsgCook();
  domainMsgCooks = {};

  get(domain) {
    const msgCook = this.domainMsgCooks[domain];
    if (!msgCook) {
      return this.defaultMsgCook;
    }
    return msgCook;
  }

  register(domain, ...msgCooks) {
    let domains = [];
    if (Array.isArray(domain)) {
      domains = domain;
    } else {
      domains.push(domain);
    }

    domains.forEach(d => {
      this.domainMsgCooks[d] = new CombinedMsgCook(...[...msgCooks].reverse(), this.get(d));
    });
  }
}
