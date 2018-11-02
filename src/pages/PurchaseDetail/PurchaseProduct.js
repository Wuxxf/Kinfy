import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import { Row, Col, Form, Input, Table, Button, DatePicker,Card } from 'antd';

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
      <Col xs={24} sm={12} md={12} lg={12} xl={5}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="订单号"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('order_num', {})(<Input placeholder="请输入订单号" />)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={5}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="供应商查询"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('supplier_name', {})(<Input placeholder="请输入供应商名称" />)}
        </FormItem>
      </Col>

      <Col xs={24} sm={12} md={12} lg={12} xl={5}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="货品查询"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('goods_name', {})(<Input placeholder="请输入货品名称" />)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={5}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="日期"
          allowClear={false}
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('order_date', {
            initialValue: rangeTime,
          })(<RangePicker allowClear={false}  />)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={4} style={{margin:'5px 0 5px 0',textAlign:'center'}}>
        <Button onClick={query} style={{ marginRight: 5 }} type="primary">
          查询
        </Button>
        <Button onClick={reset}>重置</Button>
      </Col>
    </Row>
  );
});

@connect(({ openbill, loading }) => ({
  openbill,
  loading: loading.models.openbill,
}))
@Form.create()
class SalesProduct extends Component {
  state = {
    saleProduct: [], // 销售货品
    rangeTime: [
      moment(`${thisYear}-${thisMonth}`),
      moment(`${thisYear}-${thisMonth}-${daysInMonth}`),
    ],

    current: 1, // 当前页数

    buttonStyles: 'primary', // 控制点击查询时 时间按钮样式
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchPurchasingsInfo', // 获取销售单据
      payload: {
        page: this.state.current,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openbill !== this.props.openbill) {
      const tableDate = nextProps.openbill.saleProduct;

      const tableDateLength = tableDate.length;

      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.openbill.salesProductFrom + i;
      }

      this.setState({
        total: nextProps.openbill.total,
        saleProduct: tableDate,
      });
    }
  }

  onChildChanged = time => {
    this.setState({
      buttonStyles: 'primary',
      rangeTime: time,
    });
    const start = time[0].format('YYYY-MM-DD');
    const end = time[1].format('YYYY-MM-DD');

    this.props.dispatch({
      type: 'openbill/fetchPurchasingsInfo', // 获取销售单据
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
      fields.start =  fields.order_date[0].format('YYYY-MM-DD');
      fields.end =  fields.order_date[1].format('YYYY-MM-DD');
    }
    fields.order_id = fields.order_num;
    delete fields.order_num;
    delete fields.order_date;

    this.props.dispatch({
      type: 'openbill/fetchPurchasingsInfo', // 获取销售单据
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
      type: 'openbill/fetchPurchasingsInfo', 
      payload: {
        start: moment(`${thisYear}-${thisMonth}`).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(`${thisYear}-${thisMonth}-${daysInMonth}`).format('YYYY-MM-DD HH:mm:ss'),
        page: 1,
      },
    });
  }

  render() {
    const { loading } = this.props;
    const { saleProduct, buttonStyles } = this.state;
    // 销售单据表头
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
        title: '供应商',
        dataIndex: 'order.supplier.name',
        key: 'order.supplier.name',
      },
      {
        title: '订单时间 ',
        dataIndex: 'order.order_date',
        key: 'order.order_date',
      },
      {
        title: '操作员 ',
        dataIndex: 'order.operator.name',
        key: 'order.operator.name',
      },
      {
        title: '货品名称',
        dataIndex: 'goods.name',
        key: 'goods.name',
      },
      {
        title: '数量 ',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '规格',
        dataIndex: 'goods.spec',
        key: 'goods.spec',
      },
      {
        title: '单位',
        dataIndex: 'goods.unit.name',
        key: 'goods.unit.name',
      },
      {
        title: '折扣单价',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '折扣总价',
        dataIndex: 'final_price',
        key: 'final_price',
      },
    ];

    return (
      <div>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={24} type="flex" justify="start">
            <Col span={20}>
              <TimeSelection callbackParent={this.onChildChanged} buttonStyles={buttonStyles} />
            </Col>
            <Col span={4}>
              <Link to="/openbill/sellinggoods">
                <Button style={{ float: 'right' }} type="primary">
                  开单
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Conditional queryReset={this.queryReset} rangeTime={this.state.rangeTime} queryData={this.queryData} />
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Table
            className={commonStyle.tableAdaption}
            expandedRowRender={this.expandedRowRender}
            loading={loading}
            columns={columns}
            dataSource={saleProduct}
            rowKey={record => record.id}
            locale={{ emptyText: '暂无销售货品' }}
            pagination={{
              current: this.state.current,
              total: this.state.total,
              defaultPageSize: 10,
              onChange: page => {
                this.props.dispatch({
                  type: 'openbill/fetchPurchasingsInfo', // 获取销售单据
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
          />
        </Card>
      </div>
    );
  }
}
export default SalesProduct