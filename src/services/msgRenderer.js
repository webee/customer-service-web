import { DefaultDomainMsgRendererFetcher, MsgComponentRenderer } from "~/components/Messages";
import * as commonTypeMsgs from "~/components/Messages/common";
import * as systemTypeMsgs from "~/components/Messages/system";

// domain msg renderer fetcher
const domainMsgRendererFetcher = new DefaultDomainMsgRendererFetcher();
domainMsgRendererFetcher.register(
  ["", "cs"],
  new MsgComponentRenderer({
    text: commonTypeMsgs.TextMsg,
    file: commonTypeMsgs.FileMsg,
    image: commonTypeMsgs.ImageMsg,
    voice: commonTypeMsgs.VoiceMsg
  })
);
domainMsgRendererFetcher.register(
  ["system"],
  new MsgComponentRenderer({
    notify: systemTypeMsgs.NotifyMsg,
    divider: systemTypeMsgs.DividerMsg
  })
);

export function registerDomainMsgRenderer(domain, ...msgRenderers) {
  domainMsgRendererFetcher.register(domain, ...msgRenderers);
}

export function renderMsg(message, ctx = {}) {
  const { domain, type, msg } = message;
  return domainMsgRendererFetcher.get(domain).render({ type, msg }, { domain, type, ...ctx });
}

export function describeMsg(message, ctx = {}) {
  if (!message) {
    return "-";
  }

  const { domain, type, msg } = message;
  return domainMsgRendererFetcher.get(domain).render({ type, msg }, { domain, type, ...ctx, as_description: true });
}
