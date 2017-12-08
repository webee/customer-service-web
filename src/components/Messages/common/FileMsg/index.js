import * as unitUtil from "~/utils/unit";
import * as pathUtil from "~/utils/path";
import styles from "./index.less";

export default ({ msg }) => {
  const { name = "", url, size } = msg;
  const prettySize = unitUtil.prettyByteSize(size);
  const [namePart, extPart, ext] = pathUtil.splitFileNameAndExt(name);

  return (
    <div className={styles.main}>
      <div className={styles.icon}>
        <div style={{ width: 40, height: 40, backgroundColor: "teal" }} />
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
