import { Button } from 'antd';
import styles from "./index.less";

export default ({ icon, onClick, children, style }) => {
  return (
    <div className={styles.main} style={style}>
      <Button className={styles.button} icon={icon} onClick={onClick} />
      {children}
    </div>
  );
};
