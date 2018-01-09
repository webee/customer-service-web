import React, { Fragment } from "react";
import { Cascader, Select } from "antd";
import { LabelType, pathMatchContextLabels } from "../../utils/pathLabels";
import styles from "./index.less";

function getNodeInfo(tree, labels) {
  let curTree = tree;
  let parent = { exceed: true, children: tree };
  let target = undefined;
  let targetLabel = undefined;
  for (const label of labels) {
    parent = target || parent;
    target = curTree[label];
    if (!target) {
      break;
    }
    targetLabel = label;
    curTree = target.children || {};
  }
  return { parent, target, targetLabel };
}

function getSubTree(tree, labels, extras = {}, withSub = true, lastExtras = {}) {
  const res = { children: {} };
  let curNode = res;
  let curTree = { children: tree };
  for (const label of labels) {
    const node = (curTree.children || {})[label];
    if (!node) {
      return {};
    }
    Object.assign(curNode, extras);
    if (!curNode.children) {
      curNode.children = {};
    }
    curNode.children[label] = { ...node };
    curNode = curNode.children[label];
    delete curNode.children;

    curTree = node;
  }
  if (withSub) {
    Object.assign(curNode, curTree);
  }
  Object.assign(curNode, lastExtras);
  return res.children;
}

function getFullSubTree(tree, labels, extras, lastExtras) {
  return getSubTree(tree, labels, extras, true, lastExtras);
}

function getPathTree(tree, labels, extras = {}, lastExtras = {}) {
  return getSubTree(tree, labels, extras, false, lastExtras);
}

function mergeTree(target, tree) {
  for (const label in tree) {
    if (label in target) {
      const targetNode = target[label];
      const node = tree[label];
      const children = node.children;
      delete node.children;
      Object.assign(targetNode, node);
      if (children) {
        if (!targetNode.children) {
          targetNode.children = {};
        }
        mergeTree(targetNode.children, children);
      }
    } else {
      target[label] = tree[label];
    }
  }
}

function calcContextLabelTree(labelTree, contextLabels, user) {
  const tree = {};
  for (const [t, path] of contextLabels) {
    if (t === LabelType.self || t === LabelType.self_plus) {
      if (path === "") {
        Object.assign(tree, labelTree, { "": { name: "/" } });
        break;
      }
      const labels = path.split(".");
      const { parent, target, targetLabel } = getNodeInfo(tree, labels);
      if (parent.exceed) {
        if (target && target.exceed) {
          delete parent.children[targetLabel];
        }
        mergeTree(tree, getFullSubTree(labelTree, labels, { exceed: true }));
      }
    } else if (t === LabelType.member) {
      const children = { [user.uid]: { name: `:${user.name}`, is_user: true, user } };
      if (path === "") {
        Object.assign(tree, { "": { name: "/", exceed: true, children } });
        continue;
      }
      const labels = path.split(".");
      const { parent, target, targetLabel } = getNodeInfo(tree, labels);
      if (parent.exceed) {
        if (target && target.exceed) {
          target.user = user;
        } else if (!target) {
          mergeTree(tree, getPathTree(labelTree, labels, { exceed: true }, { exceed: true, children }));
        }
      }
    }
  }
  return tree;
}

function treeToOptions(tree) {
  const options = [];
  for (const value in tree) {
    const item = tree[value];
    options.push({
      value,
      label: item.exceed ? <span style={{ color: "red" }}>{item.name}</span> : item.name,
      exceed: item.exceed,
      item,
      children: item.children ? treeToOptions(item.children) : undefined
    });
  }
  return options;
}

export default class extends React.Component {
  constructor(props) {
    super(props);
    const options = this.calcOptions(props);
    this.state = {
      options,
      // 选择的路径
      path: undefined,
      // 路径中的用户
      user: undefined,
      // 是否超出范围
      exceed: true,
      // 选中的用户uids
      uids: [],
      // 选中的标签
      labels: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { labelTree, contextLabels, user } = this.props;
    if (nextProps.labelTree != labelTree || nextProps.contextLabels != contextLabels || nextProps.user != user) {
      const options = this.calcOptions(nextProps);
      this.setState({ options });
    }
    // form control
    if (nextProps.value === null) {
      this.setState({ path: undefined, user: undefined, exceed: true, uids: [], labels: [] });
    }
  }

  calcOptions({ labelTree, contextLabels, user }) {
    const contextLabelTree = calcContextLabelTree(labelTree, contextLabels, user);
    return treeToOptions(contextLabelTree);
  }

  triggerChange = () => {
    const onChange = this.props.onChange;
    if (onChange) {
      const { path, exceed, uids } = this.state;
      if (exceed) {
        onChange(undefined);
      } else {
        onChange(`${path},${uids.join("|")}`);
      }
    }
  };

  renderUserOptions() {
    const { path, user } = this.state;
    if (user) {
      return (
        <Select.Option key={user.uid} title={user.name}>
          {user.name}
        </Select.Option>
      );
    }
    const { users } = this.props;
    return users
      .filter(user => path === undefined || pathMatchContextLabels(path, user.uid, user.context_labels))
      .map(user => (
        <Select.Option key={user.uid} title={user.name}>
          {user.name}
        </Select.Option>
      ));
  }

  render() {
    const { pathLabelPlaceholder = "选择路径", userPlaceholder = "选择用户", expandTrigger = "click" } = this.props;
    const { options, user, exceed, uids, labels } = this.state;
    const disableSelect = !!(user || exceed);
    return (
      <Fragment>
        <Cascader
          value={labels}
          changeOnSelect
          options={options}
          displayRender={this.displayRender}
          expandTrigger={expandTrigger}
          placeholder={pathLabelPlaceholder}
          onChange={this.onCascaderChange}
        />
        <Select
          disabled={disableSelect}
          optionFilterProp="title"
          value={uids}
          placeholder={userPlaceholder}
          mode="multiple"
          allowClear
          onChange={this.onSelectChange}
        >
          {this.renderUserOptions()}
        </Select>
      </Fragment>
    );
  }

  filterSelectedOptions = selectedOptions => {
    return selectedOptions.filter(o => !o.item.is_user);
  };

  onCascaderChange = (labels, selectedOptions) => {
    console.debug("onCascaderChange:", labels);
    let path = undefined;
    let user = undefined;
    let exceed = true;
    if (selectedOptions.length > 0) {
      const lastOption = selectedOptions[selectedOptions.length - 1];
      if (lastOption.item.is_user) {
        user = lastOption.item.user;
      }
      exceed = lastOption.exceed;

      path = this.filterSelectedOptions(selectedOptions)
        .map(o => o.value)
        .join(".");
    }
    const { path: prevPath, uids: prevUids } = this.state;
    const uids = user ? [user.uid] : exceed ? [] : path === prevPath ? prevUids : [];
    this.setState({ labels, path, user, exceed, uids }, this.triggerChange);
  };

  onSelectChange = uids => {
    this.setState({ uids }, this.triggerChange);
  };

  displayRender = (labels, selectedOptions) => {
    selectedOptions = this.filterSelectedOptions(selectedOptions);
    return selectedOptions.map((o, i) => (
      <Fragment key={i}>
        {i > 0 ? " / " : ""}
        {o.label}
      </Fragment>
    ));
  };
}
