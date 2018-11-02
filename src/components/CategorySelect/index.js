import React, { Component } from 'react';
import { Form, TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

@Form.create()
export default class CategorySelect extends Component {
  constructor(props) {
    super(props);
    const value = props.value || '';
    this.state = {
      defaultValue: value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        defaultValue: nextProps.value.toString(),
      });
    }
  }

  onHandleChange = e => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  };

  /**
   * 渲染树子节点
   */

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} />;
    });
  };

  render() {
    return (
      <TreeSelect
        getPopupContainer={triggerNode => triggerNode.parentNode}
        style={{ width: '182px' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        value={this.state.defaultValue}
        placeholder="请选择类别"
        treeDefaultExpandAll
        onChange={this.onHandleChange}
      >
        {this.renderTreeNodes(this.props.treeData)}
      </TreeSelect>
    );
  }
}
