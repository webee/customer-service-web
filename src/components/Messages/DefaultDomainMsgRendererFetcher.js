import CombinedMsgRenderer from "./CombinedMsgRenderer";
import DefaultMsgRenderer from "./DefaultMsgRenderer";

export default class DefaultDomainMsgRendererFetcher {
  DefaultMsgRenderer = new DefaultMsgRenderer();
  domainMsgRenderers = {};

  get(domain) {
    let msgRenderer = this.domainMsgRenderers[domain];
    if (!msgRenderer) {
      return this.DefaultMsgRenderer;
    }
    return msgRenderer;
  }

  register(domain, ...msgRenders) {
    let domains = [];
    if (Array.isArray(domain)) {
      domains = domain;
    } else {
      domains.push(domain);
    }

    domains.forEach(d => {
      this.domainMsgRenderers[d] = new CombinedMsgRenderer(...[...msgRenders].reverse(), this.get(d));
    });
  }
}
