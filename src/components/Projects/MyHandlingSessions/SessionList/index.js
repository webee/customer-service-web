import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import { Input, Badge } from 'antd';
import Moment from 'react-moment';
import styles from './index.less';


class View extends Component {
  state = {
  };

  onSearch = (value) => {
    console.log(value);
  };

  onClick = (s) => {
    // 加入到打开的会话中
    const {dispatch} = this.props;
    console.log(s);
  };

  componentDidMount() {
  }

  render() {
    let { sessions } = this.props;
    if (sessions.length === 0) {
      return (
        <p>暂时没有正在接待的会话</p>
      );
    }

    for (let i = 0; i < 4; i++) {
      sessions.push(...sessions);
    }

    return (
      <div className={styles.main}>
        <Input.Search
          placeholder="input search text"
          onSearch={this.onSearch}
        />
			<ul className={styles.ul}>
        {sessions.map((s, idx) => {
          return (<li className={styles.li} key={idx} onClick={()=>this.onClick(s)}>
            <Badge status="success"/>{s.owner}/<Moment locale="zh-cn" fromNow date={s.updated}/>
          </li>);
        })}
			</ul>
			</div>
    );
  }
}


function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps)(View);
