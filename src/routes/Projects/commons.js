import moment from "moment";
import { Fragment } from "react";
import * as msgRendererService from "~/services/msgRenderer";
import EllipsisText from "~/components/EllipsisText";

export const renderTs = (ts, def = "-", format = "LLLL") => (ts ? moment.unix(ts).format(format) : def);
export const renderMsgTs = (msg, def = "-", format = "LLLL") => (msg ? renderTs(msg.ts, def, format) : def);

export function renderLastMsg(msg, def = "-") {
  if (!msg) {
    return def;
  }

  const userType = msg.user_type === "customer" ? "客户" : "客服";
  const msgDesc = msgRendererService.describeMsg(msg);
  const text = (
    <Fragment>
      <span style={{ color: "grey" }}>{userType}:</span> {msgDesc}
    </Fragment>
  );
  return <EllipsisText text={text} width={280} />;
}
