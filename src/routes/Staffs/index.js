import React from "react";
import { connect } from "dva";
import moment from "moment";
import { Card, Table, Icon, Pagination } from "antd";
import SearchForm from "./SearchForm";
import styles from "./index.css";
import { PathLabelsRenderer } from "~/routes/Projects/Sessions/commons";

const renderBoolean = val => {
  return <Icon type={val ? "check-circle" : "close-circle"} style={{ color: val ? "green" : "black" }} />;
};

const renderNotBoolean = val => renderBoolean(!val);
const renderTs = (ts, def, format = "LLLL") => (ts ? moment.unix(ts).format(format) : def);

function getSorterOrder(sorter, key) {
  return sorter.key == key ? sorter.order : false;
}

@connect((state, ownProps) => {
  return { ...state.staffs, appData: state.app, loading: state.loading };
})
export default class extends React.Component {
  state = {
    params: {}
  };

  componentDidMount() {
    this.fetchStaffs();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "staffs/resetCurrentPage" });
  }

  get columns() {
    const { filters, sorter } = this.props;
    return [
      {
        title: "姓名",
        dataIndex: "name",
        width: 160
      },
      {
        title: "uid",
        dataIndex: "uid",
        width: 120
      },
      {
        title: "创建日期",
        dataIndex: "created",
        key: "created",
        sorter: true,
        sortOrder: getSorterOrder(sorter, "created"),
        width: 160,
        render: ts => renderTs(ts, "", "LL")
      },
      {
        title: "可用",
        dataIndex: "is_deleted",
        width: 100,
        filterMultiple: false,
        filters: [
          {
            text: "可用",
            value: false
          },
          {
            text: "停用",
            value: true
          }
        ],
        filteredValue: filters["is_deleted"],
        render: renderNotBoolean
      },
      {
        title: "在线",
        dataIndex: "is_online",
        width: 100,
        filterMultiple: false,
        filters: [
          {
            text: "在线",
            value: true
          },
          {
            text: "离线",
            value: false
          }
        ],
        filteredValue: filters["is_online"],
        render: renderBoolean
      },
      {
        title: "最后在线时间",
        dataIndex: "last_online_ts",
        key: "last_online_ts",
        sorter: true,
        sortOrder: getSorterOrder(sorter, "last_online_ts"),
        width: 300,
        render: ts => renderTs(ts, <span style={{ color: "grey" }}>未上线过</span>)
      },
      {
        title: "定位标签",
        dataIndex: "context_labels",
        render: context_labels => <PathLabelsRenderer pathLabels={context_labels} maxWidth={284} />
      }
    ];
  }

  get data() {
    const { staffs } = this.props;
    return staffs.map((s, i) => ({ key: i, ...s }));
  }

  render() {
    const { loading, pagination, appData } = this.props;
    const { staff, staffs } = appData;
    const staff_label_tree = appData.app.staff_label_tree;
    const isFetching = loading.effects["staffs/fetchStaffs"];

    return (
      <div
        className={styles.main}
        ref={r => {
          this.container = r;
        }}
      >
        <SearchForm
          loading={isFetching}
          onSearch={this.onSearch}
          staff={staff}
          staffs={Object.values(staffs)}
          staffLabelTree={staff_label_tree}
          getContainer={() => this.container}
        />
        <Table
          loading={isFetching}
          scroll={{ x: 1200 }}
          bordered={true}
          pagination={pagination}
          columns={this.columns}
          dataSource={this.data}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }

  onSearch = params => {
    console.debug("onSearch: ", params);
    this.setState({ params }, this.fetchStaffs);
  };

  handleTableChange = (pagination, filters, sorter) => {
    console.debug("handleTableChange: ", pagination, filters, sorter);
    const { dispatch } = this.props;
    dispatch({ type: "staffs/updateTableInfos", payload: { pagination, filters, sorter } });
    this.fetchStaffs();
  };

  fetchStaffs = () => {
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch({ type: "staffs/fetchStaffs", payload: params });
  };
}
