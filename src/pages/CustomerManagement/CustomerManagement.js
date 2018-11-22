import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Button,
  Table,
  Input,
  Divider,
  Modal,
  Form,
  message,
  Popconfirm,
  Icon,
  Checkbox,
  Select,
  Card,
} from 'antd';
import CustomerAdd from '@/components/CustomerAdd';
import Statistics from '@/components/Statistics';
import ColumnConfig from '@/components/ColumnConfig';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import commonStyle from '../../global.less'; // 公共样式
import styles from './CustomerManagement.less';

const FormItem = Form.Item;

const { Option } = Select;


// 表头全部列数据
const customerColumns = [
  {
    title: '客户名称',
    defaultTitile:'客户名称', // 默认名
    visible: true, // 是否显示
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '客户类型',
    defaultTitile:'客户类型', // 默认名
    visible: true, // 是否显示
    dataIndex: 'customer_type',
    key: 'customer_type',
  },
  {
    title: '应收款',
    defaultTitile:'应收款', // 默认名
    visible: true, // 是否显示
    dataIndex: 'pay',
    key: 'pay',
  },
  {
    title: '联系人',
    defaultTitile:'联系人', // 默认名
    visible: true, // 是否显示
    dataIndex: 'contacts',
    key: 'contacts',
  },
  {
    title: '手机号码',
    defaultTitile:'手机号码', // 默认名
    visible: true, // 是否显示
    dataIndex: 'mobile_phone',
    key: 'mobile_phone',
  },
  {
    title: '业务员',
    defaultTitile:'业务员', // 默认名
    visible: true, // 是否显示
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '客户标签',
    defaultTitile:'客户标签', // 默认名
    visible: true, // 是否显示
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: '创建时间',
    defaultTitile:'创建时间', // 默认名
    visible: true, // 是否显示
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: '地址',
    defaultTitile:'地址', // 默认名
    visible: true, // 是否显示
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '备注',
    defaultTitile:'备注', // 默认名
    visible: true, // 是否显示
    dataIndex: 'remarks',
    key: 'remarks',
  },
];
if (!JSON.parse(localStorage.getItem('customerColumns')))
    localStorage.setItem('customerColumns',JSON.stringify(customerColumns));

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

// 本地存储 统计数据是否显示
if (localStorage.getItem('switchLoding') === null) {
  localStorage.setItem('switchLoding', 0);
}




// 更新客户组件
const UpdateCustomer = Form.create()(props => {
  const {
    form,
    updateData, // 选中更新的供应商数据
    updatecustomerCancel,
    updatevisible,
    handleUpdate,
    employeeData,
    labelData,
  } = props;

  // 点击确定
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  return (
    <Modal
      title="添加客户"
      visible={updatevisible}
      onOk={okHandle}
      destroyOnClose={true}
      onCancel={() => updatecustomerCancel()}
      width={700}
    >
      <Row gutter={16}>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="客户名称：">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入客户名称' }],
              initialValue: updateData.name,
            })(<Input placeholder="请输入客户名称" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系电话：">
            {form.getFieldDecorator('mobile_phone', {
              rules: [
                { required: true, message: '请设置联系电话' },
                {
                  validator(rule, values, callback) {
                    if (!!values && values !== '') {
                      const mobile = /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/;
                      if (!mobile.test(values)) {
                        callback('请输入正确的手机号码！');
                      } else callback();
                    } else callback();
                  },
                },
              ],
              initialValue: updateData.mobile_phone,
            })(<Input placeholder="请设置门店电话" />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系人">
            {form.getFieldDecorator('contacts', {
              rules: [{ required: true, message: '请输入联系人' }],
              initialValue: updateData.contacts,
            })(<Input placeholder="请输入联系人" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="应付欠款">
            {form.getFieldDecorator('pay', {
              rules: [
                {
                  pattern:/^[0-9]+(.[0-9]{1,2})?$/,
                  message:'请输入正确金额',
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
              // rules: [{ required: true, message: '请选择客户类型' }],
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
              initialValue: updateData.operator,
            })(
              <Select style={{ width: 150 }} placeholder="业务员">
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
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="客户地址">
            {form.getFieldDecorator('address', {
              initialValue: updateData.address,
            })(<Input placeholder="请输入客户地址" />)}
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
              initialValue: updateData.label,
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


@connect(({ customer, store, loading }) => ({
  customer,
  store,
  loading: loading.models.customer,
}))
@Form.create()
class customerManagement extends Component {
  constructor(props) {
    super(props);
    let getColumns = JSON.parse(localStorage.getItem('customerColumns'));
    if(getColumns.length !== customerColumns.length){
        getColumns = customerColumns;
    }
    
    this.state = {
      customerData: [], // 客户列表
      current:1,
      switchLoding: !Number(localStorage.getItem('switchLoding')),
      getColumns,
      employeeData: [], // 初始化员工数据
      labelData: [], // 初始化标签数据
      updatevisible: false,
      updateData: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    // 请求员工列表 （业务员）

    dispatch({
      type: 'store/fetchEmployee',
    });

    // 请求标签列表

    dispatch({
      type: 'customer/customerLabelinf',
    });

    // 请求查询客户列表

    dispatch({
      type: 'customer/customerinf',
      payload: {
        page: 1,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { customer } = this.props;
    if (nextProps.customer !== customer) {
      const tableDate = nextProps.customer.customerData;

      const tableDateLength = tableDate.length;

      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.customer.from + i;
      }

      this.setState({
        customerData: tableDate,
        customerTotal: nextProps.customer.dataTotal,
        payTotal: nextProps.customer.payTotal,
        dataTotal: nextProps.customer.dataTotal,
        labelData: nextProps.customer.labelData,
      });
    }

    if (nextProps.store !== this.props.store) {
      this.setState({
        employeeData: nextProps.store.employeeData,
      });
    }
  }

  // 列配置返回
  newColumn = (data) => {
    localStorage.setItem('customerColumns', JSON.stringify(data));
    const getColumns = JSON.parse(localStorage.getItem('customerColumns'))
    this.setState({
      getColumns,
    })
  }

  /**
   * 添加客户
   */
  customerAdd = () => {
    this.props.dispatch({
      type: 'customer/customerinf',
      payload: {
        page: 1,
      },
    });
  };

  /**
   * 统计开关
   */
  switchange = checked => {
    this.setState({ switchLoding: !checked });
    if (checked) {
      localStorage.setItem('switchLoding', 1);
    } else {
      localStorage.setItem('switchLoding', 0);
    }
  };

  /**
   * 点击修改客户按钮
   */
  updatecustomer = record => {
    this.setState({
      updatevisible: true,
      updateData: record,
    });
  };

  /**
   * 编辑客户取消
   */
  updatecustomerCancel = () => {
    this.setState({
      updateData: {},
      updatevisible: false,
    });
  };

  /**
   * 修改客户请求
   */
  handleUpdate = fields => {
    fields.id = this.state.updateData.id
    this.setState({ updatevisible: false }, () => {
      this.props.dispatch({
        type: 'customer/updateCustomer',
        payload:fields,
        callback: res => {
          if (res.errcode) {
            message.error(res.msg);
            this.setState({
              updatevisible: true,
            });
          } else {
            message.success('更新成功');
            this.props.dispatch({
              type: 'customer/customerinf',
              payload: {
                page: this.state.current,
                name: '',
              },
            });
          }
        },
      });
    });
  };

  /**
   * 删除客户
   */
  delcustomer = record => {
    const { customerData } = this.state;
    const len = customerData.length;
    this.props.dispatch({
      type: 'customer/delCustomer',
      payload: {
        id: record.id,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          if (len === 1)
            this.props.dispatch({
              type: 'customer/customerinf',
              payload: {
                page: this.state.current - 1,
                name: '',
              },
            });
          this.props.dispatch({
            type: 'customer/customerinf',
            payload: {
              page: this.state.current,
              name: '',
            },
          });
        }
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      fieldsValue.page=1
      dispatch({
        type: 'customer/customerinf',
        payload: fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'customer/customerinf',
      payload:{
        page:1,
      },
    });
  };

  toggleForm = () => {
    const {expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  columns = (columns) =>{
    columns.unshift({
      title: (<ColumnConfig minCol={4} columns={this.state.getColumns} defaultColumns={customerColumns} callback={this.newColumn} />),
      dataIndex: 'index',
      key: 'index',
      align: 'center',
    })
    columns.push({
      title: '操作',
      width:235,
      key: 'operation',
      render: record => {
        return (
          <span>
            {/* <a onClick={() => this.toggleEditable(record)} style={{ color: '#1890ff' }}>
              报价
            </a>
            <Divider type="vertical" /> */}
            {/* <a onClick={() => this.toggleEditable(record)} style={{ color: '#1890ff' }}>
              报价单
            </a> */}
            {/* <Divider type="vertical" /> */}
            <Link to={{pathname: '/openbill/salesreceipts',state: {name: record.name,id: record.id,pay:record.pay}}} style={{ color: '#1890ff' }}>
              收款
            </Link>
            <Divider type="vertical" />
            <a onClick={() => this.updatecustomer(record)} style={{ color: '#FFC125' }}>
              修改
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.delcustomer(record)}>
              <a style={{ color: '#FF4500' }}>删除</a>
            </Popconfirm>
          </span>
        );
      },
    })  

    // 给列加上render等
    for (let i = 0; i < columns.length; i++) {

      if(columns[i].dataIndex === 'operation_mode'){
        columns[i].render = (record)=>{
          if(record===1)  return '零售';
          else if(record === 2) return '批发';
          else if(record === 3) return '零售兼批发';
        }
      }
      if(columns[i].dataIndex === 'img_path'){
        columns[i].render = (record)=>{
          return (!record?<span />:<img src={record} style={{ width: '64px' }} alt='logo' />)
        }
      }
    }
    return columns;
  }


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="客户查询" style={{marginBottom:0}}>
              {getFieldDecorator('custmer_name', {})(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号码" style={{marginBottom:0}}>
              {getFieldDecorator('mobile_phone', {})(<Input placeholder="请输入客户手机" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="客户查询">
              {getFieldDecorator('custmer_name', {})(<Input placeholder="请输入客户名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile_phone', {})(<Input placeholder="请输入客户手机" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              label="客户标签"
              // style={{ marginBottom: '0px' }}
            >
              {getFieldDecorator('label', {})(
                <Select
                  // labelInValue
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择标签"
                >
                  <Option value="is_arrears">有欠款</Option>
                  <Option value="is_free_shipping">已包邮</Option>
                  <Option value="is_arrival">已到货</Option>
                  <Option value="is_billing">已开票</Option>
                  <Option value="is_recovery">已回收</Option>
                  <Option value="is_examine">已审核</Option>
                  <Option value="is_receivables">已收款</Option>
                  <Option value="is_send">已发货</Option>
                </Select>
              )}
            </FormItem>
           
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="客户类型">
              {getFieldDecorator('customer_type', {
                initialValue: 'all',
              })(
                <Select style={{ width: '100%' }} placeholder="客户类型">
                  <Option value='all'>
                    全部
                  </Option>
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
          <Col md={8} sm={24}>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="备注查询">
              {getFieldDecorator('remarks', {
              })(<Input placeholder="请输入客户备注" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              label="隐藏零欠款客户"
            >
              {getFieldDecorator('zero_pay', {})(<Checkbox />,)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right'}}>
            <Button type="primary" htmlType="submit">
                查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  
  render() {
    const {
      customerData,
      switchLoding,
      employeeData,
      updatevisible,
      labelData,
      updateData,
      getColumns,
    } = this.state;

    const { loading } = this.props;

const columns = [];  
   
    for (let i = 0; i < getColumns.length; i++) {
      if(getColumns[i].visible){
        columns.push(getColumns[i])
      }
    }
    this.columns(columns)


    const StatisticsMethods = {
      dataSource:[{title:'客户数',total:this.state.dataTotal,units:''},{title:'应收欠款',total:this.state.payTotal,units:'元'}],    //  array [{title:'xxx',total:xxxx,units:''}]
      switchLoding,  //  boolean state
      switchange:this.switchange,    //  function  开关改变

    };

    const updateCustomerMethods = {
      updateData,
      employeeData,
      labelData,
      updatecustomerCancel: this.updatecustomerCancel,
      handleUpdate: this.handleUpdate,
    };

    return (
      <PageHeaderWrapper
        title="客户信息"
        action={<CustomerAdd labelData={labelData} employeeData={employeeData} callpackParent={data => this.customerAdd(data)} />}
      >
        <Card className={commonStyle.rowBackground}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Statistics {...StatisticsMethods} />
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Table
            className={commonStyle.tableAdaption}
            loading={loading}
            columns={columns}
            pagination={{
              total: this.state.customerTotal,
              defaultPageSize: 10,
              onChange: page => {
                this.props.dispatch({
                  type: 'customer/customerinf',
                  payload: {
                    page,
                  },
                  callback: () => {
                    this.setState({
                      current: page,
                    });
                  },
                });
              },
            }}
            dataSource={customerData}
            rowKey={record => record.id}
            locale={{ emptyText: '暂无客户' }}
            bordered={true}
          />
        </Card>
        <UpdateCustomer {...updateCustomerMethods} updatevisible={updatevisible} />
      </PageHeaderWrapper>
    );
  }
}

export default customerManagement