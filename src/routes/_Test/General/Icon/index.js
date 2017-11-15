import { Card, Icon } from 'antd';
import styles from './index.less';


export default () => {
  return (
    <Card title="图标展示" className={styles.main}>
			<Icon type="step-backward" />
      <Icon type="step-forward" />
      <Icon type="down" />
      <Icon type="up" />
    </Card>
  );
};
