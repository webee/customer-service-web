import React from "react";
import { Form, Row, Col, Input, Button, Icon } from "antd";
import { contextLabelsMatchContextLabels } from "../../utils/pathLabels";
import ContextLabelSelect from "~/components/ContextLabelSelect";
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
          <Col {...colSpanSpecs}>
            <Form.Item label="客服" colon={false}>
              {getFieldDecorator("uid")(<UserSelect users={selectStaffs} />)}
            </Form.Item>
          </Col>
          <Col sm={24} md={24} lg={24} xl={18}>
            <Form.Item label="定位标签" colon={false}>
              {getFieldDecorator("context_label")(
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
