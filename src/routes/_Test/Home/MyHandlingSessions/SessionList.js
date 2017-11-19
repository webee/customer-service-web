import React, { Component } from 'react';
import { reduxRouter } from 'dva/router';
import { connect } from 'dva';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import { Input, Avatar, Badge, Tag } from "antd";
import Moment from 'react-moment';
import styles from './SessionList.less';

const data = [
  {
    status: "success",
    title: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    ts: "1分钟前"
  },
  {
    status: "processing",
    title: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    online: true
  },
  {
    status: "error",
    title: "赵伟",
    description: "图片",
    ts: "1小时前",
    online: true
  },
  {
    status: "warning",
    title: "小明",
    description: "文件: xxx.jpg",
    ts: "昨天"
  },
  {
    status: "error",
    title: "安卓",
    description: "图片",
    ts: "昨天",
    online: true
  },
  {
    status: "warning",
    title: "IOS",
    description: "文件: xxx.jpg",
    ts: "前天"
  },
  {
    status: "success",
    title: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    ts: "1分钟前"
  },
  {
    status: "processing",
    title: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    online: true
  },
  {
    status: "error",
    title: "赵伟",
    description: "图片",
    ts: "1小时前",
    online: true
  },
  {
    status: "warning",
    title: "小明",
    description: "文件: xxx.jpg",
    ts: "昨天"
  },
  {
    status: "error",
    title: "安卓",
    description: "图片",
    ts: "昨天",
    online: true
  },
  {
    status: "warning",
    title: "IOS",
    description: "文件: xxx.jpg",
    ts: "前天"
  },
  {
    status: "success",
    title: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    ts: "1分钟前"
  },
  {
    status: "processing",
    title: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    online: true
  },
  {
    status: "error",
    title: "赵伟",
    description: "图片",
    ts: "1小时前",
    online: true
  },
  {
    status: "warning",
    title: "小明",
    description: "文件: xxx.jpg",
    ts: "昨天"
  },
  {
    status: "error",
    title: "安卓",
    description: "图片",
    ts: "昨天",
    online: true
  },
  {
    status: "warning",
    title: "IOS",
    description: "文件: xxx.jpg",
    ts: "前天"
  },
  {
    status: "success",
    title: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    ts: "1分钟前"
  },
  {
    status: "processing",
    title: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    online: true
  },
  {
    status: "error",
    title: "赵伟",
    description: "图片",
    ts: "1小时前",
    online: true
  },
  {
    status: "warning",
    title: "小明",
    description: "文件: xxx.jpg",
    ts: "昨天"
  },
  {
    status: "error",
    title: "安卓",
    description: "图片",
    ts: "昨天",
    online: true
  },
  {
    status: "warning",
    title: "IOS",
    description: "文件: xxx.jpg",
    ts: "前天"
  },
  {
    status: "success",
    title: "易旺",
    description: "文字: 来了吗？一二三四五六七八九十",
    ts: "1分钟前"
  },
  {
    status: "processing",
    title: "张三丰",
    description: "语音: 13秒",
    active: true,
    ts: "16分钟前",
    online: true
  },
  {
    status: "error",
    title: "赵伟",
    description: "图片",
    ts: "1小时前",
    online: true
  },
  {
    status: "warning",
    title: "小明",
    description: "文件: xxx.jpg",
    ts: "昨天"
  },
  {
    status: "error",
    title: "安卓",
    description: "图片",
    ts: "昨天",
    online: true
  },
  {
    status: "warning",
    title: "IOS",
    description: "文件: xxx.jpg",
    ts: "前天"
  },
];


export default class View extends Component {
  rowRenderer = ({index, key, style}) => {
    const item = data[index];
    return (
      <div key={key} className={styles.item} style={style}>
        {item.title}
      </div>
    );
  }

  render() {
    return (
      <AutoSizer>{({width, height}) => (
        <List className={styles.list}
        width={width} height={height}
        rowCount={data.length}
        rowHeight={30}
        rowRenderer={this.rowRenderer}
        />
      )}</AutoSizer>
    );
  }
}
