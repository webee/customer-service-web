import { DefaultDomainMsgCookFetcher } from "~/libs/MsgCooks";

// domain msg cook fetcher
const domainMsgCookFetcher = new DefaultDomainMsgCookFetcher();
export function registerDomainMsgCook(domain, ...msgCooks) {
  domainMsgCookFetcher.register(domain, ...msgCooks);
}

export async function cookTxMsg(txMsg, ctx = {}) {
  const { domain } = txMsg;
  return domainMsgCookFetcher.get(domain).cook(txMsg, ctx);
}
