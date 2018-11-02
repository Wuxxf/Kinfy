import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Table,
  Input,
  DatePicker,
  Button,
  Card,
  // Popconfirm,
} from 'antd';
import TimeSelection from '@/components/TimeSelection';
import commonStyle from '../../global.less'; // 公共样式

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
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
          label="来往单位"
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

@connect(({ balanceOfPay, loading }) => ({
  balanceOfPay,
  loading: loading.models.balanceOfPay,
}))
@Form.create()
class RevenueManagement extends Component {
  state = {
    current: 1, // 当前页数
    buttonStyles: 'primary', // 控制点击查询时 时间按钮样式
    rangeTime: [
      moment(`${thisYear}-${thisMonth}`),
      moment(`${thisYear}-${thisMonth}-${daysInMonth}`),
    ],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'balanceOfPay/fetchRevenue', // 获取收入单据
      payload: {
        // customer_id: '',
        // operator_id: '',
        // order_id: '',
        // start: '',
        // end: '',
        page: this.state.current,
      },
    });
  }
  
   // props 改变时调用
   componentWillReceiveProps(nextProps) {
    if (nextProps.balanceOfPay !== this.props.balanceOfPay) {
      const tableDate = nextProps.balanceOfPay.dataSource;

      const tableDateLength = tableDate.length;

      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.balanceOfPay.dataFrom + i;
      }
      this.setState({
        revenueData: tableDate,
        dataTotal: nextProps.balanceOfPay.dataTotal,

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
      type: 'balanceOfPay/fetchRevenue', // 获取付款单据
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
      fields.start = fields.order_date[0].format('YYYY-MM-DD HH:mm:ss');
      fields.end = fields.order_date[1].format('YYYY-MM-DD HH:mm:ss');
    }
    delete fields.order_date
    
    this.props.dispatch({
      type: 'balanceOfPay/fetchRevenue', // 获取销售单据
      payload:fields,
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
      type: 'balanceOfPay/fetchRevenue', // 获取销售单据
      payload: {
        start: moment(`${thisYear}-${thisMonth}`).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(`${thisYear}-${thisMonth}-${daysInMonth}`).format('YYYY-MM-DD HH:mm:ss'),
        page: 1,
      },
    });
  }

  render() {
    const { loading } =this.props;
    const { revenueData } = this.state;
    const revenueColumns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '订单号',
        dataIndex: 'order_id',
        key: 'order_id',
        render:(text,record)=>{
          return `${record.icon}${record.order_id}`
        },
      },
      {
        title: '订单时间',
        dataIndex: 'order_date',
        key: 'order_date',
      },
      {
        title: '来往单位',
        dataIndex: 'counterparty',
        key: 'counterparty',
        render:(counterparty,record)=>{
          if (!record.counterparty_name) return;
          return `${record.counterparty_name}/`
        },
      },
      {
        title: '操作员',
        dataIndex: 'operator.name',
        key: 'operator.name',
      },
      {
        title: '收入类型',
        dataIndex: 'type_name',
        key: 'type_name',
      },
      {
        title: '收入金额',
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
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //   render: (text, record) => {
      //     return (
      //       <span>
      //         <Popconfirm title="是否要删除此行？" onConfirm={() => this.del(record.id)}>
      //           <a style={{ color: '#FF4500' }}>删除</a>
      //         </Popconfirm>
      //       </span>
      //     );
      //   },
      // },
    ];

    return (
      <div>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={16}>
            <TimeSelection callbackParent={this.onChildChanged} buttonStyles={this.state.buttonStyles} />
          </Row>
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Conditional rangeTime={this.state.rangeTime} queryReset={this.queryReset} queryData={this.queryData} />
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Table
            dataSource={revenueData}
            columns={revenueColumns}
            loading={loading}
            rowKey={record => record.id}    
            pagination={{
              current: this.state.current,
              total: this.state.dataTotal,
              defaultPageSize: 10,
              onChange: page => {
                this.props.dispatch({
                  type: 'balanceOfPay/fetchRevenue', // 获取付款单据
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
      </div>
    );
  }
}
export default RevenueManagement