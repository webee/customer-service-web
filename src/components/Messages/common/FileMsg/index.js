import { Icon } from "antd";
import * as unitUtil from "~/utils/unit";
import * as pathUtil from "~/utils/path";
import styles from "./index.less";

const extToIcon = {
  // unknown
  "": { type: "file-unknown", color: "Plum" },
  // text
  txt: { type: "file-text" },
  //// office
  // excel
  xls: { type: "file-excel", color: "LightCoral" },
  xlsx: { type: "file-excel", color: "LightCoral" },
  // ppt
  ppt: { type: "file-ppt", color: "IndianRed" },
  pptx: { type: "file-ppt", color: "IndianRed" },
  // pdf
  pdf: { type: "file-pdf", color: "DarkRed" },
  // image
  jpg: { type: "picture", color: "ForestGreen" },
  jpeg: { type: "picture", color: "ForestGreen" },
  png: { type: "picture", color: "ForestGreen" }
};
const DEFAULT_ICON_TYPE = { type: "file" };

export default ({ msg }) => {
  const { name = "", url, size } = msg;
  const prettySize = unitUtil.prettyByteSize(size);
  const [namePart, extPart, ext] = pathUtil.splitFileNameAndExt(name);
  const { type, color } = extToIcon[ext] || DEFAULT_ICON_TYPE;

  return (
    <div className={styles.main}>
      <div className={styles.icon}>
        <Icon type={type} style={{ fontSize: 40, color }} />
      </div>
      <div className={styles.description}>
        <div className={styles.title}>
          <div className={styles.name}>{namePart}</div>
          <div className={styles.ext}>{extPart}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.detail}>
          <div className={styles.info}>{prettySize}</div>
          <div className={styles.action}>
            <a href={url} download>
              下载
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
