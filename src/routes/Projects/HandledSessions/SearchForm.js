import React from "react";
import { Form, Row, Col, Input, Button, Icon, Switch, Radio, Select } from "antd";
import { contextLabelsMatchContextLabels } from "~/utils/pathLabels";
import ContextLabelSelect from "~/components/ContextLabelSelect";
import DateTimeRange from "~/components/DateTimeRange";
import UserSelect from "~/components/UserSelect";
import { withContainerContext } from "~/components/utils";
import styles from "./SearchForm.less";

const ConSelect = withContainerContext(Select);

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
    const { loading, staff, staffs, staffLabelTree } = this.props;
    const selectStaffs = staffs.filter(u =>
      contextLabelsMatchContextLabels(staff.uid, staff.context_labels, u.uid, u.context_labels)
    );
    const { getFieldDecorator } = this.props.form;
    const gutterSpecs = { xs: 8, sm: 16, md: 16, lg: 24, xl: 24 };
    const colSpanSpecs = { sm: 24, md: 12, lg: 8, xl: 6 };
    const colSpanSpecs2 = { sm: 24, md: 12, lg: 12, xl: 8 };

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
              {getFieldDecorator("owner")(<Input placeholder="用户名/手机号/用户ID" />)}
            </Form.Item>
          </Col>
          <Col {...{ sm: 8, md: 8, lg: 4, xl: 4 }}>
            <Form.Item label="我" colon={false}>
              {getFieldDecorator("filter_self")(
                <ConSelect allowClear>
                  <Select.Option value="only">仅我接待</Select.Option>
                  <Select.Option value="exclude">除我接待</Select.Option>
                </ConSelect>
              )}
            </Form.Item>
          </Col>
          <Col {...colSpanSpecs2}>
            <Form.Item label="项目标签" colon={false}>
              {getFieldDecorator("tag")(<Input />)}
            </Form.Item>
          </Col>
          <Col {...colSpanSpecs2}>
            <Form.Item label="结束时间" colon={false}>
              {getFieldDecorator("closed_ts_range")(<DateTimeRange />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button loading={loading} type="primary" htmlType="submit">
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
