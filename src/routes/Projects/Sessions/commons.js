import moment from "moment";
import { Fragment } from "react";
import { Icon, Badge, Tag } from "antd";
import * as msgRendererService from "~/services/msgRenderer";
import EllipsisText from "~/components/EllipsisText";

export const renderBoolean = val => {
  return <Icon type={val ? "check-circle" : "close-circle"} style={{ color: val ? "green" : "black" }} />;
};

export const renderNotBoolean = val => renderBoolean(!val);

export const renderTs = (ts, def = "-", format = "LLLL") => (ts ? moment.unix(ts).format(format) : def);
export const renderMsgTs = (msg, def = "-", format = "LLLL") => (msg ? renderTs(msg.ts, def, format) : def);
export const renderTsFromNow = (ts, def) => (ts ? moment.unix(ts).fromNow() : def);

export function renderLastMsg(msg, def = "-", maxWidth) {
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
  return <EllipsisText text={text} maxWidth={maxWidth} />;
}

export function genCustomerMobileName({ name, mobile }, def = "") {
  if (name && mobile) {
    return `${name}-${mobile}`;
  } else if (name) {
    return name;
  } else if (mobile) {
    return mobile;
  }
  return def;
}

export const renderStaff = staff => <Badge status={staff.is_online ? "success" : "default"} text={staff.name} />;
export const renderCustomer = (user, width = 200) => {
  const name = genCustomerMobileName(user, "-");
  const text = <Badge status={user.is_online ? "success" : "default"} text={name} />;
  return <EllipsisText text={text} tipText={name} maxWidth={width} />;
};

export const TagRenderer = ({ tag, maxWidth, ...props }) => {
  return (
    <Tag color="geekblue" {...props}>
      <EllipsisText text={tag} maxWidth={maxWidth} />
    </Tag>
  );
};

export const TagsRenderer = ({ tags, ...props }) => {
  return tags.map((tag, i) => <TagRenderer key={i} tag={tag} {...props} />);
};

export const PathLabelRenderer = ({ pathLabel, maxWidth, ...props }) => {
  const [type, path] = pathLabel;
  return (
    <Tag color="purple" {...props}>
      <EllipsisText text={`${type} / ${path}`} maxWidth={maxWidth} />
    </Tag>
  );
};

export const PathLabelsRenderer = ({ pathLabels, ...props }) => {
  return pathLabels.map((pathLabel, i) => <PathLabelRenderer key={i} pathLabel={pathLabel} {...props} />);
};
