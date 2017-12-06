import React from "react";
import Loader from "~/components/Loader";
import { connect } from "dva";
import { Card } from "antd";
import { Form, Input, Button } from "antd";
import { Route, Redirect } from "dva/router";
import qs from "qs";
import { asValidator } from "../../commons/form";
import * as authService from "../../services/auth";
import styles from "./index.less";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
};

@connect()
@Form.create()
export default class Auth extends React.Component {
  state = {
    loaded: false,
    authed: false
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { jwt } = form.getFieldsValue();
    this.setState({ loaded: false });
    dispatch({ type: "auth/login", payload: { jwt: jwt } })
      .then(() => {
        this.setState({ authed: true, loaded: true });
      })
      .catch(() => {
        this.setState({ loaded: true });
      });
  };

  componentDidMount() {
    this.props.form.validateFields();

    const { dispatch, location } = this.props;
    const query = qs.parse(location.search.replace(/^(\?|\ )+/, ""));
    const jwt = query.jwt;
    if (jwt) {
      // 提供了jwt, 则尝试登录
      dispatch({ type: "auth/login", payload: { jwt, login_url: query.login_url } })
        .then(() => {
          this.setState({ authed: true });
        })
        .catch(() => {
          this.setState({ loaded: true });
        });
    } else {
      let login_url = query.login_url;
      if (login_url === undefined) {
        login_url = authService.loadLoginURL();
      }
      if (login_url) {
        // 提供了login_url, 则到指定的地址登录
        window.location.href = `${login_url}?auth_url=${window.location.href}`;
      } else {
        this.setState({ loaded: true });
      }
    }
  }

  render() {
    const { match, location, form } = this.props;
    // /[root/]auth
    const { from } = location.state || { from: { pathname: `${match.path.substr(0, match.path.length - 5)}/` } };
    if (this.state.authed) {
      return <Redirect to={from} />;
    }

    const query = qs.parse(location.search);
    const jwt = query.jwt;
    const jwtError = form.isFieldTouched("jwt") && form.getFieldError("jwt");
    return (
      <div className={styles.main}>
        <Loader loaded={this.state.loaded}>
          <Card className={styles.content} bordered={false}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item
                {...formItemLayout}
                label="JWT"
                validateStatus={jwtError ? "error" : ""}
                help={jwtError || ""}
                hasFeedback
              >
                {form.getFieldDecorator("jwt", {
                  validateFirst: true,
                  rules: [
                    { required: true, message: "请输入客服jwt" },
                    { pattern: /[^.]+\.[^.]+\.[^.]+/g, message: "jwt格式错误" },
                    { validator: asValidator(authService.validateJWT) }
                  ]
                })(<Input.TextArea rows={6} placeholder="请输入客服jwt" />)}
              </Form.Item>
              <Form.Item {...formTailLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  disabled={hasErrors(form.getFieldsError())}
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
