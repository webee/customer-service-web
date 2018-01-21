import { newlineToTarget } from "~/components/utils";
import styles from "./index.less";

export default ({ msg, as_description }) => {
  if (as_description) {
    return msg.text;
  }

  return <div className={styles.main} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br/>") }} />;
};
