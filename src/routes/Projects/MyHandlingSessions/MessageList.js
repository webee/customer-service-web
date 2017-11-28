import React from "react";
import cs from "classnames";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer";
import EmptyContent from "./EmptyContent";
import styles from "./MessageList.less";

export default class extends React.Component {
  state = {
    width: undefined
  };
  cache = new CellMeasurerCache({
    defaultHeight: 50,
    fixedWidth: true,
    keyMapper: (rowIndex, columnIndex) => {
      const { projMsgs } = this.props;
      const { msgs } = projMsgs;
      const msg = msgs[rowIndex];
      return msg.msg_id;
    }
  });

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
    const { projMsgs } = this.props;
    const msgs = projMsgs.msgs || [];
    return (
      <AutoSizer onResize={this.onResize}>
        {({ width, height }) => (
          <List
            className={styles.list}
            deferredMeasurementCache={this.cache}
            width={width}
            height={height}
            rowCount={msgs.length}
            scrollToIndex={msgs.length - 1}
            rowHeight={this.cache.rowHeight}
            rowRenderer={this.rowRenderer}
            noRowsRenderer={this.noRowsRenderer}
          />
        )}
      </AutoSizer>
    );
  }
}
