import { Button } from 'antd';
import styles from "./index.less";

export default ({ icon, onClick, children, className, style }) => {
  return (
    <div className={`${styles.main} ${className}`} style={style}>
      <Button className={styles.button} icon={icon} onClick={onClick} />
      <div className={styles.content}>{children}</div> 
    </div>
  );
};
