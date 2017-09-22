import { Icon } from 'antd';
import styles from './index.css';


export default () => {
  return (
    <div className={styles.icon}>
			<Icon type="step-backward" />
      <Icon type="step-forward" />
      <Icon type="down" />
      <Icon type="up" />
		</div>
  );
};
