import React from "react";
import { Form, Row, Col, Input, Button, Icon, Switch } from "antd";
import { contextLabelsMatchContextLabels } from "~/utils/pathLabels";
import ContextLabelSelect from "~/components/ContextLabelSelect";
import DateTimeRange from "~/components/DateTimeRange";
import NumberRange from "~/components/NumberRange";
import UserSelect from "~/components/UserSelect";
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
    const selectStaffs = staffs.filter(u =>
      contextLabelsMatchContextLabels(staff.uid, staff.context_labels, u.uid, u.context_labels)
    );
    const { getFieldDecorator } = this.props.form;
    const gutterSpecs = { xs: 8, sm: 16, md: 16, lg: 24, xl: 24 };
    const colSpanSpecs = { sm: 24, md: 12, lg: 8, xl: 6 };

    return (
      <Form className={styles.main} onSubmit={this.handleSearch}>
        <Row gutter={gutterSpecs}>
          <Col sm={24} md={24} lg={20} xl={14}>
            <Form.Item label="定位标签" colon={false}>
              {getFieldDecorator("context_label", { initialValue: null })(
                <ContextLabelSelect
                  pathLabelPlaceholder="请选择定位标签"
                  userPlaceholder="请选择客服"
                  labelTree={staffLabelTree}
                  contextLabels={staff.context_labels}
                  user={staff}
                  users={selectStaffs}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...colSpanSpecs}>
            <Form.Item label="接待客服" colon={false}>
              {getFieldDecorator("handler")(<UserSelect placeholder="选择客服" users={selectStaffs} />)}
            </Form.Item>
          </Col>
          <Col {...colSpanSpecs}>
            <Form.Item label="所属用户" colon={false}>
              {getFieldDecorator("owner")(<Input placeholder="用户姓名/uid/手机" />)}
            </Form.Item>
          </Col>
          <Col {...{ sm: 8, md: 8, lg: 4, xl: 4 }}>
            <Form.Item label="排除自己" colon={false}>
              {getFieldDecorator("exclude_self", { initialValue: false })(<Switch />)}
            </Form.Item>
          </Col>
          <Col {...colSpanSpecs}>
            <Form.Item label="未回复数" colon={false}>
              {getFieldDecorator("unhandled_msg_count_range")(<NumberRange min={0} transformer={Math.floor} />)}
            </Form.Item>
          </Col>
          <Col {...{ sm: 24, md: 12, lg: 8, xl: 8 }}>
            <Form.Item label="消息时间" colon={false}>
              {getFieldDecorator("msg_ts_range")(<DateTimeRange />)}
            </Form.Item>
          </Col>
          <Col {...colSpanSpecs}>
            <Form.Item label="项目标签" colon={false}>
              {getFieldDecorator("tag")(<Input />)}
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
