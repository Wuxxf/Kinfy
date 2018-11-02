import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
// 客户类型
const customerType = [
  {
    id: 0,
    name: '零售',
  },
  {
    id: 1,
    name: '批发',
  },
];

@connect(({ customer, store }) => ({
  customer,
  store,
}))
@Form.create()
class CustomerAddSimple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeData: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'store/fetchEmployee', // 员工列表
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.store !== this.props.store) {
      this.setState({
        employeeData: nextProps.store.employeeData,
      });
    }
    if (nextProps.updateData !== this.props.updateData) {
      this.setState({});
    }
  }

  okHandle = () => {
    const { validateFields, resetFields } = this.props.form;

    validateFields((err, fieldsValue) => {
      if (err) return;
      this.add(fieldsValue);
      resetFields();
    });
  };

  add = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: 'customer/addCustomer',
      payload: fields,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.props.callpackParent();
        }
      },
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { employeeData } = this.state;

    return (
      <Modal
        title="添加客户"
        destroyOnClose={true}
        visible={this.props.visible}
        onCancel={this.props.onClose}
        onOk={this.okHandle}
      >
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="客户名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入客户名称' }],
          })(<Input placeholder="请输入客户名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="客户类型">
          {getFieldDecorator('customer_type', {
            rules: [{ required: true, message: '请选择客户类型' }],
          })(
            <Select style={{ width: '295px' }} placeholder="客户类型">
              {customerType.map(id => {
                return (
                  <Option key={id.id} value={id.name}>
                    {id.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="联系电话">
          {getFieldDecorator('mobile_phone', {
            rules: [
              { required: true, message: '请设置联系电话' },
              {
                pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
                message: '请输入正确的手机号码！',
              },
            ],
          })(<Input placeholder="请设置门店电话" />)}
        </FormItem>
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="联系人">
          {getFieldDecorator('contacts', {
            rules: [{ required: true, message: '请输入联系人' }],
          })(<Input placeholder="请输入联系人" />)}
        </FormItem>
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="业务员">
          {getFieldDecorator('operator', {
            rules: [{ required: true, message: '请选择业务员' }],
          })(
            <Select style={{ width: '295px' }} placeholder="业务员">
              {employeeData.map(id => {
                return (
                  <Option key={id.id} value={id.name}>
                    {id.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}
export default CustomerAddSimple