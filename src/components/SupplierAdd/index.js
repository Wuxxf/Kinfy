import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Button, message } from 'antd';

const FormItem = Form.Item;

// 添加供应商组件
const CreateAddEmpForm = Form.create()(props => {
  const { form, visible, handleAddModal, supplierAdd } = props;

  // 点击确定
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      handleAddModal(fieldsValue);
      form.resetFields();
    });
  };

  return (
    <Modal title="添加供应商" visible={visible} onOk={okHandle} onCancel={() => supplierAdd()}>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商名称">
        {form.getFieldDecorator('name', {
          rules: [
            { required: true, message: '请输入供应商名称' },
            { whitespace: true, message: '供应商名称不能为空' },
          ],
        })(<Input placeholder="请输入供应商名称" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="应付欠款">
        {form.getFieldDecorator('pay', {
          rules: [
            {
              pattern: /^[0-9]+(.[0-9]{1,2})?$/,
              message: '请输入正确金额',
            },
          ],
        })(<Input placeholder="请输入应付欠款" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="联系人">
        {form.getFieldDecorator('contacts', {
          rules: [
            { required: true, message: '请输入联系人' },
            { whitespace: true, message: '联系人不能为空' },
          ],
        })(<Input placeholder="请输入联系人" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="联系电话">
        {form.getFieldDecorator('mobile_phone', {
          rules: [
            { required: true, message: '请设置联系电话' },
            {
              pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
              message: '请输入正确的手机号码！',
            },
          ],
        })(<Input placeholder="请设置门店电话" maxLength={11} />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商地址">
        {form.getFieldDecorator('address', {})(<Input placeholder="请输入供应商地址" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商备注">
        {form.getFieldDecorator('remarks')(<Input placeholder="请输入供应商备注" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ supplier, loading }) => ({
  supplier,
  loading: loading.models.supplier,
}))
class SupplierAdd extends Component {
  state = {
    visible: false,
  };

  // 点击添加供应商按钮
  supplierAdd = flag => {
    this.setState({
      visible: !!flag,
    });
  };

  // 添加供应商请求
  handleAdd = fields => {
    this.props.dispatch({
      type: 'supplier/add',
      payload: fields,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            visible: false,
          });
          this.props.callpackParent();
        }
      },
    });
  };

  render() {
    const { visible } = this.state;
    const parentMethods = {
      supplierAdd: this.supplierAdd,
      handleAddModal: this.handleAdd,
    };

    return (
      <div>
        <Button type="primary" onClick={() => this.supplierAdd(true)} style={{ marginTop: 5 }}>
          添加供应商
        </Button>
        <CreateAddEmpForm {...parentMethods} visible={visible} />
      </div>
    );
  }
}
export default SupplierAdd