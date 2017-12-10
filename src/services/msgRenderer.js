import { DefaultDomainMsgRendererFetcher, MsgComponentRenderer } from "~/components/Messages";
import * as commonTypeComponents from "~/components/Messages/common";

// domain msg renderer fetcher
const domainMsgRendererFetcher = new DefaultDomainMsgRendererFetcher();
domainMsgRendererFetcher.register(
  ["", "cs"],
  new MsgComponentRenderer({
    text: commonTypeComponents.TextMsg,
    file: commonTypeComponents.FileMsg,
    image: commonTypeComponents.ImageMsg,
    voice: commonTypeComponents.VoiceMsg
  })
);

export function registerDomainMsgRenderer(domain, ...msgRenderers) {
  domainMsgRendererFetcher.register(domain, ...msgRenderers);
}

export function renderMsg({ domain, type, msg }, ctx = {}) {
  return domainMsgRendererFetcher.get(domain).render({ type, msg }, { domain, type, ...ctx });
}
