import React from 'react';
import Loader from 'react-loader';
import { connect } from 'dva';
import { Card } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import { Route, Redirect } from 'dva/router';
import * as authService from '../services/auth';
import styles from './AuthPage.less';
import queryString from 'query-string';


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};


class AuthPageForm extends React.Component {
  state = {
    loaded: true,
  };

  handleSubmit = (e) => {
  };

  componentWillMount() {
    const { dispatch, location, history } = this.props;
    const query = queryString.parse(location.search);
    const jwt = query.jwt;
    if (jwt) {
      // 提供了jwt, 则尝试登录
      this.setState({loaded: false});
      dispatch({type: 'auth/login', payload: {jwt, login_url: query.login_url}}).then(() => {
        this.setState({loaded: true});
      });
    } else {
      const login_url = authService.loadLoginURL();
      if (login_url) {
        // 提供了login_url, 则到指定的地址登录
        history.replace(`${login_url}?auth_url=${location.href}`);
      }
    }
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  render() {
    const { location, form } = this.props;
    const query = queryString.parse(location.search);
    const jwt = query.jwt;
    const { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form;
    const jwtError = isFieldTouched('jwt') && getFieldError('jwt');
    return (
      <div className={styles.main}>
        <Loader loaded={this.state.loaded}>
				<Card className={styles.card}>
          <Form>
            <Form.Item {...formItemLayout}
              label="JWT"
              validateStatus={jwtError ? 'error' : ''}
              help={jwtError || ''}
              hasFeedback
            >
              {getFieldDecorator('jwt', {
                rules: [{
                  required: true,
                  message: '请输入客服jwt',
                }],
              })(
                <Input.TextArea rows={6} placeholder="请输入客服jwt" />
              )}
            </Form.Item>
            <Form.Item {...formTailLayout}>
              <Button type="primary" htmlType="submit" style={{width: '100%'}}
                      disabled={hasErrors(getFieldsError())}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
				</Card>
        </Loader>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Form.create()(AuthPageForm));
