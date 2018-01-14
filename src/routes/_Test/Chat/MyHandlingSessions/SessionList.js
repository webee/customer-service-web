import React, { Component } from "react";
import { reduxRouter } from "dva/router";
import { connect } from "dva";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import SessionItem from "./SessionItem";
import { Input, Checkbox } from "antd";
import Moment from "react-moment";
import styles from "./SessionList.less";

const Search = Input.Search;

const data = [
  {
    status: "success",
    name: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    ts: "1分钟前",
    unread: 1
  },
  {
    status: "processing",
    name: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    online: true,
    unread: 0
  },
  {
    status: "error",
    name: "赵伟",
    description: "图片",
    ts: "1小时前",
    unread: 10,
    online: true
  },
  {
    status: "warning",
    name: "小明",
    description: "文件: xxx.jpg",
    ts: "昨天",
    unread: 3
  },
  {
    status: "error",
    name: "安卓",
    description: "图片",
    ts: "昨天",
    unread: 4,
    online: true
  },
  {
    status: "warning",
    name: "IOS",
    unread: 8,
    description: "文件: xxx.jpg",
    ts: "前天"
  },
  {
    status: "success",
    name: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    unread: 13,
    ts: "1分钟前"
  },
  {
    status: "processing",
    name: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    unread: 4,
    online: true
  },
  {
    status: "error",
    name: "赵伟",
    description: "图片",
    ts: "1小时前",
    unread: 7,
    online: true
  },
  {
    status: "warning",
    name: "小明",
    description: "文件: xxx.jpg",
    unread: 2,
    ts: "昨天"
  },
  {
    status: "error",
    name: "安卓",
    description: "图片",
    ts: "昨天",
    unread: 0,
    online: true
  },
  {
    status: "warning",
    name: "IOS",
    description: "文件: xxx.jpg",
    unread: 3,
    ts: "前天"
  },
  {
    status: "success",
    name: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    unread: 3,
    ts: "1分钟前"
  },
  {
    status: "processing",
    name: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    unread: 3,
    online: true
  },
  {
    status: "error",
    name: "赵伟",
    description: "图片",
    ts: "1小时前",
    unread: 3,
    online: true
  },
  {
    status: "warning",
    name: "小明",
    description: "文件: xxx.jpg",
    unread: 3,
    ts: "昨天"
  },
  {
    status: "error",
    name: "安卓",
    description: "图片",
    ts: "昨天",
    unread: 3,
    online: true
  },
  {
    status: "warning",
    name: "IOS",
    description: "文件: xxx.jpg",
    unread: 3,
    ts: "前天"
  },
  {
    status: "success",
    name: "易旺",
    unread: 3,
    description: "文字: 来了吗？一二三四五六七八九十",
    ts: "1分钟前"
  },
  {
    status: "processing",
    name: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    unread: 3,
    online: true
  },
  {
    status: "error",
    name: "赵伟",
    description: "图片",
    ts: "1小时前",
    unread: 3,
    online: true
  },
  {
    status: "warning",
    name: "小明",
    description: "文件: xxx.jpg",
    unread: 3,
    ts: "昨天"
  },
  {
    status: "error",
    name: "安卓",
    description: "图片",
    ts: "昨天",
    unread: 3,
    online: true
  },
  {
    status: "warning",
    name: "IOS",
    description: "文件: xxx.jpg",
    unread: 3,
    ts: "前天"
  },
  {
    status: "success",
    name: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    unread: 3,
    ts: "1分钟前"
  },
  {
    status: "processing",
    name: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    unread: 3,
    online: true
  },
  {
    status: "error",
    name: "赵伟",
    description: "图片",
    ts: "1小时前",
    unread: 3,
    online: true
  },
  {
    status: "warning",
    name: "小明",
    description: "文件: xxx.jpg",
    unread: 3,
    ts: "昨天"
  },
  {
    status: "error",
    name: "安卓",
    description: "图片",
    ts: "昨天",
    unread: 3,
    online: true
  },
  {
    status: "warning",
    name: "IOS",
    description: "文件: xxx.jpg",
    unread: 3,
    ts: "前天"
  }
];

export default class View extends Component {
  rowRenderer = ({ index, key, style }) => {
    const item = data[index];
    return (
      <div key={key} className={styles.item} style={style}>
        <SessionItem
          name={item.name}
          description={item.description}
          ts={item.ts}
          unread={item.unread}
          online={item.online}
        />
      </div>
    );
  };

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <Search
            placeholder="uid/name"
            style={{ width: "100%" }}
            onSearch={value => console.debug(value)}
          />
          <Checkbox>在线</Checkbox>
          <Checkbox>待回</Checkbox>
        </div>
        <div className={styles.body}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              className={styles.list}
              width={width}
              height={height}
              rowCount={data.length}
              rowHeight={60}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
        </div>
      </div>
    );
  }
}
