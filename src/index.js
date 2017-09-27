import dva from 'dva';
import createHistory from 'history/createBrowserHistory'
import createLoading from 'dva-loading';
import { message } from 'antd';
import './index.css';

const ERROR_MSG_DURATION = 3; // 3 seconds
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
  onReducer(reducer) {
    return (state, action) => {
      if (action.type === 'RESET') {
        action.payload.forEach((ns) => {
          state[ns] = undefined;
        });
      }

      return reducer(state, action);
    }
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/auth'));
app.model(require('./models/app'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

// debug
import envConfig from './config';
console.debug('env config: ', envConfig);
