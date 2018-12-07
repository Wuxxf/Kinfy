import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Row, Form, Input, Modal, Select, Button, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

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

// 添加客户Modal
const CreateAddEmpForm = Form.create()(props => {
  const { modalVisible, form, handleAddModal, customerAdd, employeeData, labelData } = props;
  // 点击确定
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAddModal(fieldsValue);
    });
  };
  return (
    <Modal
      title="添加客户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => customerAdd()}
      width={700}
    >
      <Row gutter={16}>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="客户名称：">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入客户名称' }],
            })(<Input placeholder="请输入客户名称" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系电话：">
            {form.getFieldDecorator('mobile_phone', {
              rules: [
                { required: true, message: '请设置联系电话' },
                {
                  pattern: /^1\d{10}$/,
                  message: '请输入正确的手机号码！',
                },
              ],
            })(<Input placeholder="请设置门店电话" />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系人">
            {form.getFieldDecorator('contacts', {
              rules: [{ required: true, message: '请输入联系人' }],
            })(<Input placeholder="请输入联系人" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="应付欠款">
            {form.getFieldDecorator('pay', {
              rules: [
                {
                  validator(rule, values, callback) {
                    const reg = /^[0-9]+(.[0-9]{1,2})?$/;
                    if (!reg.test(values)) {
                      callback('请输入正确金额');
                    } else callback();
                  },
                },
              ],
              initialValue: 0,
            })(<Input placeholder="请输入应付欠款" />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="客户类型">
            {form.getFieldDecorator('customer_type', {
              initialValue: customerType[0].name,
            })(
              <Select style={{ width: 150 }} placeholder="客户类型">
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
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="业务员">
            {form.getFieldDecorator('operator', {
              rules: [{ required: true, message: '请选择业务员' }],
            })(
              <Select style={{ width: 150 }} placeholder="业务员">
                {employeeData.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="客户地址">
            {form.getFieldDecorator('address')(<Input placeholder="请输入客户地址" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="客户备注">
            {form.getFieldDecorator('remarks')(<Input placeholder="请输入客户备注" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="标签">
            {form.getFieldDecorator('label', {
              rules: [
                {
                  validator(rule, values, callback) {
                    if (!!values) {
                      if (values.length > 3) {
                        callback('最多只能选择三个标签');
                      } else callback();
                    } else callback();
                  },
                },
              ],
            })(
              <Select style={{ width: 250 }} mode="multiple" placeholder="请选择标签">
                {labelData.map(id => {
                  return (
                    <Option key={id.id} value={id.id}>
                      {id.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ store, customer }) => ({
  store,
  customer,
}))
class CustomerAdd extends Component {
  state = {
    modalVisible: false,
  };

  componentDidMount() {}

  componentWillReceiveProps() {}

  // 点击添加客户按钮
  customerAdd = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // 添加客户请求
  handleAdd = fields => {
    this.props.dispatch({
      type: 'customer/addCustomer',
      payload: {
        name: fields.name,
        pay: fields.pay,
        customer_type: fields.customer_type,
        address: fields.address,
        operator: fields.operator,
        remarks: fields.remarks,
        contacts: fields.contacts,
        mobile_phone: fields.mobile_phone,
        label: fields.label,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            modalVisible: false,
          });
          this.props.callpackParent(res.data);
        }
      },
    });
  };

  render() {
    const { modalVisible } = this.state;
    const { employeeData, labelData } = this.props;

    // 添加客户 props? 传给添加客户Modal
    const parentMethods = {
      customerAdd: this.customerAdd,
      handleAddModal: this.handleAdd,
      employeeData,
      labelData,
    };
    return (
      <div>
        <Button type="primary" onClick={() => this.customerAdd(true)} style={{ marginTop: 5 }}>
          添加客户
        </Button>
        <CreateAddEmpForm {...parentMethods} modalVisible={modalVisible} />
      </div>
    );
  }
}

export default CustomerAdd
