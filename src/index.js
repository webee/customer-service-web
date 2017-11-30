import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import 'moment/locale/zh-cn';
import createLoading from 'dva-loading';
import { message } from 'antd';
// lib csses
import 'ant-design-pro/dist/ant-design-pro.css';
import 'react-virtualized/styles.css'
import envConfig from './config';
import './polyfill';
import './g2';
import './index.less';

// debug
console.debug('env config: ', envConfig);

const ERROR_MSG_DURATION = 3; // 3 seconds
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
  onReducer(reducer) {
    return (state, action) => {
      let newState = state;
      const { type, payload } = action;
      if (type === 'RESET') {
        if (payload === '*') {
          // 清空所有
          newState = {};
        } else {
          // 清空指定的分支
          newState = { ...state };
          payload.forEach((ns) => {
            newState[ns] = undefined;
          });
        }
      }

      return reducer(newState, action);
    };
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Register models
app.model(require('./models/auth'));
app.model(require('./models/app'));
app.model(require('./models/project'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
