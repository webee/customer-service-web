import { DefaultDomainMsgRendererFetcher, MsgComponentRenderer } from "~/components/Messages";
import * as commonTypeComponents from "~/components/Messages/common";

// domain msg renderer fetcher
const domainMsgRendererFetcher = new DefaultDomainMsgRendererFetcher();
domainMsgRendererFetcher.register(
  ["", "cs"],
  new MsgComponentRenderer({
    text: commonTypeComponents.TextMsg,
    // file: commonTypeComponents.FileMsg,
    // iamge: commonTypeComponents.ImageMsg,
    // voice: commonTypeComponents.VoiceMsg
  })
);

export function registerDomainMsgRenderer(domain, ...msgRenderers) {
  domainMsgRendererFetcher.register(domain, ...msgRenderers);
}

export function renderMsg({ domain, type, msg }) {
  return domainMsgRendererFetcher.get(domain).render({ type, msg });
}
