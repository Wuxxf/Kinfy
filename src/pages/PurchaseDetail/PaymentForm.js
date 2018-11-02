import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Form,
  Input,
  Table,
  Button,
  Divider,
  message,
  Popconfirm,
  Card,
  DatePicker,
} from 'antd';

import PaymentUpdate from '@/components/PaymentUpdate';
import TimeSelection from '@/components/TimeSelection';
import commonStyle from '../../global.less'; // 公共样式


const FormItem = Form.Item;
const { RangePicker } = DatePicker;

// 获取当前月
let thisMonth = moment().month() + 1;
if (thisMonth < 10) {
  thisMonth = `0${thisMonth}`;
}
// 天数（月）
const daysInMonth = moment().daysInMonth();

// 年份
const thisYear = moment().year();


// 条件查询组件
const Conditional = Form.create()(props => {
  const { form, queryData, rangeTime } = props;


  const query = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      queryData(fieldsValue);
    });
  };
  const reset = () => {
    form.resetFields();
    props.queryReset();
  };
  return (
    <Row>
      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="订单号"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('order_id', {})(<Input placeholder="请输入订单号" />)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="客户查询"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('customer_name', {})(<Input placeholder="请输入客户名称" />)}
        </FormItem>
      </Col>

      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="日期"
          allowClear={false}
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('order_date', {
            initialValue: rangeTime,
          })(<RangePicker allowClear={false} />)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{margin:'5px 0 5px 0',textAlign:'center'}}>
        <Button onClick={query} style={{ marginRight: 5 }} type="primary">
          查询
        </Button>
        <Button onClick={reset}>重置</Button>
      </Col>
    </Row>
  );
});

@connect(({ openbill, store, loading }) => ({
  openbill,
  store,
  loading: loading.models.openbill,
}))
@Form.create()
class SalesSlip extends Component {
  state = {
    salesData: [], // 销售数据单据
    rangeTime: [
      moment(`${thisYear}-${thisMonth}`),
      moment(`${thisYear}-${thisMonth}-${daysInMonth}`),
    ],

    employeeData: [], // 操作员(员工)

    updateVisible: false, // 更新Modal
    current: 1, // 当前页数

    buttonStyles: 'primary', // 控制点击查询时 时间按钮样式
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchPayment', // 获取付款单据
      payload: {
        page: this.state.current,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openbill !== this.props.openbill) {
      const tableDate = nextProps.openbill.salesData;
      // console.log(nextProps.openbill.salesData)
      const tableDateLength = tableDate.length;

      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.openbill.salesFrom + i;
      }
      this.setState({
        salesData: tableDate,
        salesTotal: nextProps.openbill.salesTotal,

      });
    }

    if (nextProps.store !== this.props.store) {
      this.setState({
        employeeData: nextProps.store.employeeData,
      });
    }
  }

  onChildChanged = time => {
    this.setState({
      buttonStyles: 'primary',
      rangeTime: time,
    });
    const start = time[0].format('YYYY-MM-DD HH:mm:ss');
    const end = time[1].format('YYYY-MM-DD HH:mm:ss');
    this.props.dispatch({
      type: 'openbill/fetchPayment', // 获取付款单据
      payload: {
        start,
        end,
        page: 1,
      },
    });
  };


  /**
   * 查询
   */
  queryData = fields => {
    this.setState({
      buttonStyles: 'default',
    });

    if (fields.order_date.length) {
      fields.start = fields.order_date[0].format('YYYY-MM-DD');
      fields.end = fields.order_date[1].format('YYYY-MM-DD');
    }
    delete fields.order_date
    this.props.dispatch({
        type: 'openbill/fetchPayment', // 获取付款单据
        payload:fields ,
      });
    // console.log(fields);
  }


  queryReset=()=>{
    this.setState({
      buttonStyles: 'default',
      rangeTime: [
        moment(`${thisYear}-${thisMonth}`),
        moment(`${thisYear}-${thisMonth}-${daysInMonth}`),
      ],
    })
    this.props.dispatch({
      type: 'balanceOfPay/fetchPayment', // 获取销售单据
      payload: {
        start: moment(`${thisYear}-${thisMonth}`).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(`${thisYear}-${thisMonth}-${daysInMonth}`).format('YYYY-MM-DD HH:mm:ss'),
        page: 1,
      },
    });
  }


  /**
   * 更新单据
   */
  updateSales = e => {
   
    this.setState({
      // expandesRowData: res.data[0].info,
      updateVisible: true,
      updateData: e,
      // expandesRowKey:e,
    });

  };

  /**
   * 更新单据返回
   */
  handleCancel = () => {
    this.setState({
      updateVisible: false,
    });
  };
  
  /**
   * 更新单据保存
   */
  updateSave = () => {
    this.setState({
      updateVisible: false,
    });
    this.props.dispatch({
      type: 'openbill/fetchPayment', // 获取付款单据
      payload: {
        start: this.state.rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
        end: this.state.rangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
        page: this.state.current,
      },
    });
  };

  /**
   * 删除单据
   */
  delReceipt = e => {
    const { dispatch } = this.props;
    const { salesData, rangeTime } = this.state;
    const salesLength = salesData.length;
    const start = rangeTime[0].format('YYYY-MM-DD HH:mm:ss');
    const end = rangeTime[1].format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'openbill/delPayment',
      payload: {
        id: e.id,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          if (salesLength === 1)
            dispatch({
              type: 'openbill/fetchPayment',
              payload: {
                start,
                end,
                page: this.state.current - 1,
              },
            });
          else
            dispatch({
              type: 'openbill/fetchPayment',
              payload: {
                start,
                end,
                page: this.state.current,
              },
            });
        }
      },
    });
  };

  /**
   * 打印
   */
  printing = () => {
    console.log('暂时木有打印这功能');
  };


  render() {
    const { loading } = this.props;
    const { salesData, buttonStyles, employeeData } = this.state;

    // 付款单据表头
    const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '订单号',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: '客户',
      dataIndex: 'customer.name',
      key: 'customer.name',
    },
    {
      title: '订单时间 ',
      dataIndex: 'order_date',
      key: 'order_date',
    },
    {
      title: '操作员 ',
      dataIndex: 'operator.name',
      key: 'operator.name',
    },
    {
      title: '实收',
      dataIndex: 'pay',
      key: 'pay',
    },
    {
      title: '收款账户',
      dataIndex: 'pay_method',
      key: 'pay_method',
      render:(record)=>{
        if(record===1)  return '现金';
        else if(record === 2) return '银行存款';
        else if(record === 3) return 'POS收银';
        else if(record === 4) return '微信';
        else if(record === 5) return '支付宝';
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: '操作',
      key: 'operation',
      render: record => {
        return (
          <span>
            <a onClick={() => this.updateSales(record)} style={{ color: '#FFC125' }}>
            修改
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.printing()} style={{ color: '#1890ff' }}>
            打印
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.delReceipt(record)}>
              <a style={{ color: '#FF4500' }}>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

    const updateSalesMethods = {
      employeeData,
      updateData: this.state.updateData,
      handleCancel: this.handleCancel,
      callback: this.updateSave,
    };

    return (
      <div>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={24} type="flex" justify="start">
            <Col span={20}>
              <TimeSelection callbackParent={this.onChildChanged} buttonStyles={buttonStyles} />
            </Col>
            <Col span={4}>
              <Link to="/openbill/purchasepayment">
                <Button style={{ float: 'right' }} type="primary">
                  开单
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Conditional
            rangeTime={this.state.rangeTime}
            queryData={this.queryData}
            queryReset={this.queryReset}
          />
        </Card>

        <Card className={commonStyle.rowBackground}>
          <Table
            className={commonStyle.tableAdaption}
            loading={loading}
            columns={columns}
            dataSource={salesData}
            rowKey={record => record.id}
            locale={{ emptyText: '暂无付款单据' }}
            pagination={{
              current: this.state.current,
              total: this.state.salesTotal,
              defaultPageSize: 10,
              onChange: page => {
                this.props.dispatch({
                  type: 'openbill/fetchPayment', // 获取付款单据
                  payload: {
                    start: this.state.rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
                    end: this.state.rangeTime[1].format('YYYY-MM-DD HH:mm:ss'),
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
          />
        </Card>
        <PaymentUpdate visible={this.state.updateVisible} {...updateSalesMethods} />
      </div>
    );
  }
}
export default SalesSlip