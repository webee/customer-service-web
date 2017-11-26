import React from "react";
import cs from "classnames";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import CellMeasurer, { CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer";
import EmptyContent from "./EmptyContent";
import styles from "./MessageList.less";

const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true,
  // TODO: 使用msg_id
  keyMapper: (rowIndex, columnIndex) => {
    return rowIndex;
  },
});

export default class extends React.Component {
  state = {
    width: undefined
  };

  rowRenderer = ({ index, key, parent, style }) => {
    const { projMsgs } = this.props;
    const { msgs } = projMsgs;
    const msg = msgs[index];
    const { type, content, user_type, user_id } = msg;
    // TODO: 基于type来渲染
    const itemClassNames = cs(styles.item, { [styles.left]: user_type === 'customer', [styles.right]: user_type === 'staff'});
    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        <div style={style}>
          <div className={itemClassNames}>
            <div className={styles.head}>{user_id}</div>
            <div className={styles.body}>{content}</div>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  noRowsRenderer = () => <EmptyContent />;

  onResize = ({ width }) => {
    if (this.state.width !== width) {
      cache.clearAll();
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
            deferredMeasurementCache={cache}
            width={width}
            height={height}
            rowCount={msgs.length}
            scrollToIndex={msgs.length - 1}
            rowHeight={cache.rowHeight}
            rowRenderer={this.rowRenderer}
            noRowsRenderer={this.noRowsRenderer}
          />
        )}
      </AutoSizer>
    );
  }
}
