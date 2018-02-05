import { newlineToTarget } from "~/components/utils";
import styles from "./index.less";

export default ({ msg, as_description }) => {
  const text = String(msg.text);
  if (as_description) {
    return text;
  }

  return <div className={styles.main} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br/>") }} />;
};
