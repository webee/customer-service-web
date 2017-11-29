import React from "react";
import cs from "classnames";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer";
import EmptyContent from "./EmptyContent";
import styles from "./MessageList.less";

export default class extends React.Component {
  state = {
    width: 0,
  };
  cache = new CellMeasurerCache({
    defaultHeight: 50,
    fixedWidth: true,
    keyMapper: (rowIndex, columnIndex) => {
      const { projMsgs: { msgs } } = this.props;
      const msg = msgs[rowIndex];
      return msg.msg_id;
    }
  });
  // list ref
  list = undefined;

  rowRenderer = ({ index, key, parent, style }) => {
    const { staffs, customers, projMsgs } = this.props;
    const { msgs } = projMsgs;
    const msg = msgs[index];
    const { type, content, user_type, user_id } = msg;
    let userName = user_id;
    switch (user_type) {
      case "staff":
        const staff = staffs[user_id];
        userName = staff ? staff.name : userName;
        break;
      case "customer":
        const customer = customers[user_id];
        userName = customer ? customer.name : userName;
        break;
    }
    // TODO: 基于type来渲染
    const itemClassNames = cs(styles.item, {
      [styles.left]: user_type === "customer",
      [styles.right]: user_type === "staff"
    });
    return (
      <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        <div style={style}>
          <div className={itemClassNames}>
            <div className={styles.head}>{userName}</div>
            <div className={styles.body}>{content}</div>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  noRowsRenderer = () => <EmptyContent />;

  onResize = ({ width }) => {
    if (this.state.width !== width) {
      this.cache.clearAll();
      this.setState({ width });
    }
  };

  render() {
    const msgs = this.props.projMsgs.msgs || [];
    return (
      <AutoSizer onResize={this.onResize}>
        {({ width, height }) => (
          <List
            ref={i => (this.list = i)}
            className={styles.list}
            deferredMeasurementCache={this.cache}
            width={width}
            height={height}
            rowCount={msgs.length}
            rowHeight={this.cache.rowHeight}
            rowRenderer={this.rowRenderer}
            noRowsRenderer={this.noRowsRenderer}
          />
        )}
      </AutoSizer>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    this._scrollToBottom();
    // FIXME: 解决List的scrollToIndex参数的bug
    setTimeout(() => this._scrollToBottom(), 50);
  }

  componentDidMount() {
    this._scrollToBottom();
  }

  _scrollToBottom() {
    const msgs = this.props.projMsgs.msgs || [];
    const lastRowIndex = msgs.length - 1;
    this.list.scrollToRow(lastRowIndex);
  }
}
