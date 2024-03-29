import { DefaultDomainMsgCodecFetcher, JSONObjectMsgCodec } from "~/libs/MsgCodecs";

// domain msg codec fetcher
const domainMsgCodecFetcher = new DefaultDomainMsgCodecFetcher();
const commonMsgTypes = new Set(["text", "file", "image", "voice"]);
domainMsgCodecFetcher.register(["", "cs"], new JSONObjectMsgCodec(commonMsgTypes));

export function registerDomainMsgCodec(domain, ...msgCodecs) {
  domainMsgCodecFetcher.register(domain, ...msgCodecs);
}

export function encodeMsg({ domain, type, msg }) {
  return { domain, ...domainMsgCodecFetcher.get(domain).encode({ type, msg }) };
}

export function decodeMsg({ domain, type, content }) {
  return { domain, ...domainMsgCodecFetcher.get(domain).decode({ type, content }) };
}
