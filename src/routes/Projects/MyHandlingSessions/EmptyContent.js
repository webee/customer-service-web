import { Icon } from 'antd';
import styles from './EmptyContent.less';


export default ({ fontSize=48, color="#EDEFF2" }) => {
  return (
    <div className={styles.main}>
      <Icon type="message" style={{fontSize, color}}/>
    </div>
  );
};
