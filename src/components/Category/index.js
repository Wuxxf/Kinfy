import React, { Component } from 'react';
import { Form, Modal, Input, TreeSelect } from 'antd';
import CategorySelect from '@/components/CategorySelect';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

@Form.create()
 class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValue: {
        id: null,
        name: null,
        pid: null,
      },
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue !== this.props.initialValue) {
      this.setState({
        initialValue: nextProps.initialValue,
      });
    }
  }

  /**
   * 保存
   */
  save = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (typeof this.props.dataInfo === 'function') {
        this.props.dataInfo(fieldsValue);
      }
    });
  };

  /**
   * 重置表单
   */
  resetForm = () => this.props.form.resetFields();

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
    const { form } = this.props;
    const { initialValue } = this.state;

    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.save}
        onCancel={this.props.cancel}
      >
        <FormItem style={{ height: 0, width: 0, padding: 0, margin: 0 }}>
          {form.getFieldDecorator('id', {
            initialValue: initialValue.id,
          })(<span />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级类别">
          {form.getFieldDecorator('pid', {
            rules: [{ required: true, message: '请选择上级类别' }],
            initialValue: initialValue.pid,
          })(<CategorySelect treeData={this.props.treeData} />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类别名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入类别' }],
            initialValue: initialValue.name,
          })(<Input placeholder="请输入类别" />)}
        </FormItem>
      </Modal>
    );
  }
}
export default Category