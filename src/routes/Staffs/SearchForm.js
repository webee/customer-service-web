import React from "react";
import { Form, Row, Col, Input, Button, Icon } from "antd";
import ContextLabelSelect from "~/components/ContextLabelSelect";
import styles from "./SearchForm.less";

@Form.create()
export default class extends React.Component {
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { onSearch } = this.props;
        if (onSearch) {
          onSearch(values);
        }
      }
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { staff, staffs, staffLabelTree } = this.props;
    const { getFieldDecorator } = this.props.form;
    const gutterSpecs = { xs: 8, sm: 16, md: 16, lg: 24, xl: 24 };
    const colSpanSpecs = { sm: 24, md: 12, lg: 8, xl: 6 };

    return (
      <Form className={styles.main} onSubmit={this.handleSearch}>
        <Row gutter={gutterSpecs}>
          <Col {...colSpanSpecs}>
            <Form.Item label="姓名" colon={false}>
              {getFieldDecorator("name")(<Input placeholder="客服姓名" />)}
            </Form.Item>
          </Col>
          <Col {...{ sm: 12, md: 6, lg: 4, xl: 4 }}>
            <Form.Item label="uid" colon={false}>
              {getFieldDecorator("uid")(<Input placeholder="客服uid" />)}
            </Form.Item>
          </Col>
          <Col sm={24} md={24} lg={24} xl={14}>
            <Form.Item label="定位标签" colon={false}>
              {getFieldDecorator("context_label")(
                <ContextLabelSelect
                  pathLabelPlaceholder="请选择定位标签"
                  userPlaceholder="请选择客服"
                  labelTree={staffLabelTree}
                  contextLabels={staff.context_labels}
                  user={staff}
                  users={staffs}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
