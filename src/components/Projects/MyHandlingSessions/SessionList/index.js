import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import { Input, Badge } from 'antd';
import Moment from 'react-moment';
import styles from './index.less';
import {dispatchDomainType, dispatchDomainTypeEffect} from '~/services/project';


class View extends Component {
  state = {
  };

  onSearch = (value) => {
    console.log(value);
  };

  onClick = (id) => {
    // 加入到打开的会话中
    dispatchDomainType(this.props, 'myHandling/openSession', id);
  };

  componentDidMount() {
  }

  render() {
    const { myHandling } = this.props;
    const { sessions, list_sessions } = myHandling;
    if (list_sessions.length === 0) {
      return (
        <p>暂时没有正在接待的会话</p>
      );
    }

    return (
      <div className={styles.main}>
        <Input.Search
          placeholder="input search text"
          onSearch={this.onSearch}
        />
			<ul className={styles.ul}>
        {list_sessions.map((id, idx) => {
          const s = sessions[id];
          return (<li className={styles.li} key={idx} onClick={()=>this.onClick(id)}>
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
