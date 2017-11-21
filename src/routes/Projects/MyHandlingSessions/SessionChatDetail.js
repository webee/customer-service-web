import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import SplitPane from "react-split-pane";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import styles from "./SessionChatDetail.less";

export default class View extends Component {
  static contextTypes = {
    projectDomain: PropTypes.string,
    projectType: PropTypes.string
  };

  getRowRenderer() {
    const { session } = this.props;
    return ({ index, key, style }) => {
      return (
        <div key={key} className={styles.item} style={style}>
          <p>消息#{index}</p>
        </div>
      );
    };
  }

  noRowsRenderer = () => <p>没有对话消息</p>;

  render() {
    const { projectDomain, projectType } = this.context;
    const { session } = this.props;
    return (
      <div className={styles.splitter}>
        <div className={styles.splitHeader}>Header#{session.id}</div>
        <div className={styles.splitContent}>
          <SplitPane
            className={styles.splitPane}
            primary="second"
            split="vertical"
            defaultSize={280}
            minSize={280}
            maxSize={320}
            paneClassName={styles.main}
          >
          <SplitPane
            className={styles.splitPane}
            primary="second"
            split="horizontal"
            defaultSize={150}
            minSize={100}
            maxSize={400}
            paneClassName={styles.main}
          >
            <div style={{flex: 'auto'}}>
              <AutoSizer>
                {({ width, height }) => (
                  <List
                    className={styles.msgList}
                    width={width}
                    height={height}
                    rowCount={100}
                    rowHeight={20}
                    rowRenderer={this.getRowRenderer()}
                    noRowsRenderer={this.noRowsRenderer}
                  />
                )}
              </AutoSizer>;
            </div>
            <div>消息发送区域</div>
          </SplitPane>
            <div>会话信息区域</div>
          </SplitPane>
        </div>
      </div>
    );
  }
}
