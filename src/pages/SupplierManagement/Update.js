import React, { Component } from 'react';
import {
  Form,
  Modal,
  Input,
} from 'antd'


const FormItem = Form.Item;

class UpdateSupplier extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  render() {
    const {
      form,
      updateData, // 选中更新的供应商数据
      updateCancel,
      updatevisible,
      handleUpdate, // 更新请求
    } = this.props;

    const updatehandleOk = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;

        handleUpdate(fieldsValue);
        form.resetFields();
      });
    };

    return (
      <Modal
        title="修改供应商信息"
        destroyOnClose={true}
        visible={updatevisible}
        onOk={updatehandleOk}
        onCancel={updateCancel}
        okText="保存"
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商名称">
          {form.getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入供应商名称' },
              { whitespace: true, message: '供应商名称不能为空' },
            ],
            initialValue: updateData.name,
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
            initialValue: updateData.pay,
          })(<Input placeholder="请输入应付欠款" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="联系人">
          {form.getFieldDecorator('contacts', {
            rules: [
              { required: true, message: '请输入联系人' },
              { whitespace: true, message: '供应商名称不能为空' },
            ],
            initialValue: updateData.contacts,
          })(<Input placeholder="请输入联系人" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="联系电话">
          {form.getFieldDecorator('mobile_phone', {
            rules: [
              { required: true, message: '请设置联系电话' },
              {
                pattern: /^1\d{10}$/,
                message: '请输入正确的手机号码！',
              },
            ],
            initialValue: updateData.mobile_phone,
          })(<Input placeholder="请设置门店电话" maxLength={11} />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商地址">
          {form.getFieldDecorator('address', {
            initialValue: updateData.address,
          })(<Input placeholder="请输入供应商地址" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商备注">
          {form.getFieldDecorator('remarks', {
            initialValue: updateData.remarks,
          })(<Input placeholder="请输入供应商备注" />)}
        </FormItem>
      </Modal>
    )
  }
}

export default  Form.create()(UpdateSupplier)
