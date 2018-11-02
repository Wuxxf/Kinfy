import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {
  Tag,
  Row,
  Col,
  Form,
  Icon,
  Modal,
  Card,
  Input,
  Table,
  Select,
  Button,
  Divider,
  message,
  Checkbox,
  Popconfirm,
  DatePicker,
} from 'antd';

import Statistics from '@/components/Statistics';
import SalesUpdate from '@/components/SalesUpdate';
import TimeSelection from '@/components/TimeSelection';
import styles from './SalesSlip.less';
import commonStyle from '../../global.less'; // 公共样式

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 获取当前月
let thisMonth = moment().month() + 1;
if (thisMonth < 10) {
  thisMonth = `0${thisMonth}`;
}
// 天数（月）
const daysInMonth = moment().daysInMonth();

// 年份
const thisYear = moment().year();

// 销售单据表头
const columnsAll = [
  {
    index: 0,
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    index: 1,
    title: '订单号',
    dataIndex: 'order_id',
    key: 'order_id',
  },
  {
    index: 2,
    title: '客户',
    dataIndex: 'customer.name',
    key: 'customer.name',
  },
  {
    index: 3,
    title: '订单时间 ',
    dataIndex: 'order_date',
    key: 'order_date',
  },
  {
    index: 4,
    title: '操作员 ',
    dataIndex: 'operator.name',
    key: 'operator.name',
  },
  {
    index: 5,
    title: '原价',
    dataIndex: 'total_price',
    key: 'total_price',
  },
  {
    index: 6,
    title: '折后应收 ',
    dataIndex: 'total_price_final',
    key: 'total_price_final',
  },
  {
    index: 7,
    title: '其他支付',
    dataIndex: 'other_pay',
    key: 'other_pay',
  },
  {
    index: 8,
    title: '实收金额',
    dataIndex: 'pay',
    key: 'pay',
  },
  {
    index: 9,
    title: '成本',
    dataIndex: 'cost',
    key: 'cost',
  },
  {
    index: 10,
    title: '利润',
    dataIndex: 'profit',
    key: 'profit',
  },
  {
    index: 11,
    title: '收款账户',
    dataIndex: 'pay_method',
    key: 'pay_method',
  },
  {
    index: 12,
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
  },
  {
    index: 13,
    title: '标签',
    dataIndex: 'state',
    key: 'state',
  },
];

// 本地存储 表头信息
if (localStorage.getItem('SalesSlipColumns') === null) {
  const tmp = columnsAll.slice(0, 5);

  // 存数组 转String
  localStorage.setItem('SalesSlipColumns', JSON.stringify(tmp));
}
const checkedLocal = JSON.parse(localStorage.getItem('SalesSlipColumns'));

for (let i = 0; i < checkedLocal.length; i++) {
  checkedLocal[i] = JSON.stringify(checkedLocal[i]);
}

// Checkbox组件 Table表头设置 多选框
const checkboxAllData = [];
for (let i = 0; i < columnsAll.length; i += 1) {
  checkboxAllData.push(
    <Col span={8} key={columnsAll[i].title}>
      <Checkbox value={JSON.stringify(columnsAll[i])}>{columnsAll[i].title}</Checkbox>
    </Col>
  );
}

// 条件查询组件
const Conditional = Form.create()(props => {
  const { form, queryData, rangeTime, employeeData ,queryReset,operatorId} = props;

  // 操作员 option
  const eeOption = employeeData.map(fields => {
    return (
      <Option value={fields.id} key={fields.id}>
        {fields.name}
      </Option>
    );
  });

  const query = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      queryData(fieldsValue);
    });
  };
  const reset = () => {
    form.resetFields();
    queryReset();
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
          {form.getFieldDecorator('custmer_name', {})(<Input placeholder="请输入客户名称" />)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="操作员"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('operator_id', {
            initialValue: operatorId,
          })(<Select style={{ width: '100%' }}>{eeOption}</Select>)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="标签"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('label', {})(
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
      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="日期"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('order_date', {
            initialValue: rangeTime,
          })(<RangePicker allowClear={false} />)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={5} className={styles.serachRow}>
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
  constructor(props){
    super(props);
    let operatorId = 8; // 默认是当前登录的
    if(props.location.state){
      if(props.location.state.operator_id)
        operatorId  = props.location.state.operator_id
    }

    this.state={
      salesData: [], // 销售数据单据
      rangeTime: [
        moment(`${thisYear}-${thisMonth}`),
        moment(`${thisYear}-${thisMonth}-${daysInMonth}`),
      ],
      operatorId,
      switchLoding: !Number(localStorage.getItem('switchLoding')),
  
      settingVisible: false, // 表头设置Modal
      checkedValue: checkedLocal, // 多选框的选中
  
      employeeData: [], // 操作员(员工)
      expandesRowData: [], //  详情数据
      expandesRowKey: [], // 展开的行
      updateVisible: false, // 更新Modal
      current: 1, // 当前页数
  
      buttonStyles: 'primary', // 控制点击查询时 时间按钮样式
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchSales', // 获取销售单据
      payload: {
        page: this.state.current,
        operator_id:this.state.operatorId,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openbill !== this.props.openbill) {
      const tableDate = nextProps.openbill.salesData;

      const tableDateLength = tableDate.length;

      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.openbill.salesFrom + i;
      }
      this.setState({
        salesData: tableDate,
        salesTotal: nextProps.openbill.salesTotal,
        profitTotal: nextProps.openbill.profitTotal, // 利润
        costTotal: nextProps.openbill.costTotal, // 成本
        payTotal: nextProps.openbill.payTotal, // 实收
        saleTotal: nextProps.openbill.saleTotal, // 销售
      });
    }

    if (nextProps.store !== this.props.store) {
      this.setState({
        employeeData: nextProps.store.employeeData,
      });
    }
  }

  onExpand = (expanded, record) =>{
    if(expanded)
      this.props.dispatch({
        type: 'openbill/fetchSalesDetail',
        payload: {
          id: record.id,
        },
        callback: res => {
          if (res.errcode) {
            message.error('不好！好像出错了！');
          } else {
            this.setState({
              expandesRowData: res.data[0].info,
              expandesRowKey:[record.id],
            });
          }
        },
      });   
    else{
      this.setState({
        expandesRowKey:[],
      })
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
      type: 'openbill/fetchSales', // 获取销售单据
      payload: {
        start,
        end,
        page: 1,
      },
    });
  };

  /**
   * 表头设置Checkbox onchange 事件
   * @param {array} checkedValues 选中的数据
   */
  onCheckChange = checkedValues => {
    if (checkedValues.length >= 5) {
      const tmp = [];

      for (let i = 0; i < checkedValues.length; i++) {
        tmp.push(JSON.parse(checkedValues[i]));
      }

      // 存数组 转String

      localStorage.setItem('SalesSlipColumns', JSON.stringify(tmp));
    } else {
      message.error('列表字段至少显示五个');
      return;
    }

    this.setState({
      checkedValue: checkedValues,
    });
  };

  /**
   * 设置表头
   */
  setting = () => {
    this.setState({
      settingVisible: true,
    });
  };

  /**
   * 设置列表字段Modal 返回按钮
   *
   */
  settingCancel = () => {
    this.setState({
      settingVisible: false,
    });
  };

  /**
   * 设置列表字段Modal 确定按钮
   *
   */
  settingOk = () => {
    this.setState({
      settingVisible: false,
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
   * 展开的行
   */
  expandedRowRender = () => {
    const expandedRowColumns = [
      {
        title: '货品名称',
        dataIndex: 'goods.name',
        key: 'goods.name',
      },
      {
        title: '条形码',
        dataIndex: 'goods.bar_code',
        key: 'goods.bar_code',
      },
      {
        title: '规格',
        dataIndex: 'goods.spece',
        key: 'goods.spece',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
      },
      {
        title: '类别',
        dataIndex: 'goods.category.name',
        key: 'goods.category.name',
      },
      {
        title: '数量',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '单价',
        dataIndex: 'retail_price',
        key: 'retail_price',
      },
      {
        title: '总价',
        dataIndex: 'final_price',
        key: 'final_price',
      },
      {
        title: '单成本',
        dataIndex: 'goods.unit_cost',
        key: 'goods.unit_cost',
      },
    ];
    return (
      <Table
        columns={expandedRowColumns}
        dataSource={this.state.expandesRowData}
        pagination={false}
        rowKey={record => record.id}
        bordered={true}
      />
    );
  };

  
  // // 展开行变化时 调用
  // expandedRows = e => {
  //   if (e.length === 0) {
  //     this.setState({
  //       expandesRowKey: e,
  //     });
  //   }
  //   if (e.length > 1) {
  //     e.shift();
  //   }
  //   if (e.toString() !== this.state.expandesRowKey.toString() && e.length !== 0) {
  //     this.props.dispatch({
  //       type: 'openbill/fetchSalesDetail',
  //       payload: {
  //         id: e[0],
  //       },
  //       callback: res => {
  //         if (res.errcode) {
  //           message.error('不好！好像出错了！');
  //         } else {
  //           this.setState(
  //             {
  //               expandesRowData: res.data[0].info,
  //               expandesRowKey: e,
  //             },
  //             () => {
  //               this.setState({
  //                 expandesRowKey: e,
  //               });
  //               // console.log(res.data)
  //             }
  //           );
  //         }
  //       },
  //     });
  //   }
  // };

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
      type: 'openbill/fetchSales', // 获取销售单据
      payload:fields,
    });
    // console.log(fields);
  }

  /**
   * 重置
   */
  queryReset = () => {
    this.setState({
      buttonStyles: 'default',
      rangeTime: [
        moment(`${thisYear}-${thisMonth}`),
        moment(`${thisYear}-${thisMonth}-${daysInMonth}`),
      ],
    })
    this.props.dispatch({
      type: 'openbill/fetchSales', // 获取销售单据
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
    this.props.dispatch({
      type: 'openbill/fetchSalesDetail',
      payload: {
        id: e.id,
      },
      callback: res => {
        if (res.errcode) {
          message.error('不好！好像出错了！');
        } else {
          this.setState({
            updateVisible: true,
            updateData: res.data[0],
          });
        }
      },
    });
  }

  /**
   * 更新单据返回
   */
  handleCancel = () => {
    this.setState({
      updateVisible: false,
    });
  }

  /**
   * 更新单据保存
   */
  updateSave = () => {
    this.setState({
      updateVisible: false,
    });
    this.props.dispatch({
      type: 'openbill/fetchSales', // 获取销售单据
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
  delSales = e => {
    const { dispatch } = this.props;
    const { salesData, rangeTime } = this.state;
    const salesLength = salesData.length;
    const start = rangeTime[0].format('YYYY-MM-DD HH:mm:ss');
    const end = rangeTime[1].format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'openbill/delSales',
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
              type: 'openbill/fetchSales',
              payload: {
                start,
                end,
                page: this.state.current - 1,
              },
            });
          else
            dispatch({
              type: 'openbill/fetchSales',
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
   * 打印单据
   */
  printingSales = () => {
    console.log('暂时木有打印单据这功能');
  };

  /**
   * 打印小票
   */
  printingTicket = () => {
    console.log('暂时木有打印小票这功能');
  };

  render() {
    const { loading } = this.props;
    const { salesData, buttonStyles, employeeData, switchLoding, checkedValue } = this.state;

    // 操作员 option
    const eeOption = [];
    eeOption.push(
      employeeData.map(fields => {
        return (
          <Option value={fields.id} key={fields.id}>
            {fields.name}
          </Option>
        );
      })
    );
    const dataSource = [
      { title: '销售金额', total: this.state.saleTotal, units: '元' },
      { title: '实收金额', total: this.state.payTotal, units: '元' },
      { title: '成本', total: this.state.costTotal, units: '元' },
      { title: '利润', total: this.state.profitTotal, units: '元' },
    ];
    const StatisticsMethods = {
      switchLoding,
      switchange: this.switchange,
      dataSource,
    };

    // 操作 title
    const operationtitle = (
      <span>
        操作
        <Icon
          type="setting"
          style={{ cursor: 'pointer', fontSize: 26, color: '#08c', float: 'right' }}
          onClick={() => this.setting()}
        />
      </span>
    );

    // 表格操作 列
    const operation = {
      index: 14,
      title: operationtitle,
      key: 'operation',
      render: record => {
        return (
          <span>
            <a onClick={() => this.updateSales(record)} style={{ color: '#FFC125' }}>
              修改
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.printingSales()} style={{ color: '#1890ff' }}>
              打印单据
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.printingTicket(record)} style={{ color: '#1890ff' }}>
              打印小票
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.delSales(record)}>
              <a style={{ color: '#FF4500' }}>删除</a>
            </Popconfirm>
          </span>
        );
      },
    };

    // 给表头加上render
    let columns = [];
    columns = JSON.parse(localStorage.getItem('SalesSlipColumns'));

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].dataIndex === 'state')
        columns[i].render = (text, record) => {
          return (
            <div>
              <Tag color="#108ee9" visible={record.is_arrival} style={{ marginTop: 2 }}>
                已到货
              </Tag>
              <Tag color="#108ee9" visible={record.is_billing} style={{ marginTop: 2 }}>
                已开票
              </Tag>
              <Tag color="#108ee9" visible={record.is_arrears} style={{ marginTop: 2 }}>
                有欠款
              </Tag>
              <Tag color="#108ee9" visible={record.is_free_shipping} style={{ marginTop: 2 }}>
                已包邮
              </Tag>
              <Tag color="#108ee9" visible={record.is_recovery} style={{ marginTop: 2 }}>
                已回收
              </Tag>
              <Tag color="#108ee9" visible={record.is_examine} style={{ marginTop: 2 }}>
                已审核
              </Tag>
              <Tag color="#108ee9" visible={record.is_receivables} style={{ marginTop: 2 }}>
                已收款
              </Tag>
              <Tag color="#108ee9" visible={record.is_send} style={{ marginTop: 2 }}>
                已发货
              </Tag>
            </div>
          );
        };
      else if(columns[i].dataIndex === 'pay_method'){
        columns[i].render = (record)=>{
          if(record===1)  return '现金';
          else if(record === 2) return '银行存款';
          else if(record === 3) return 'POS收银';
          else if(record === 4) return '微信';
          else if(record === 5) return '支付宝';
        }
      }
    }

    columns.push(operation);

    columns.sort((obj1, obj2) => {
      const val1 = obj1.index;
      const val2 = obj2.index;
      if (val1 > val2) {
        return 1;
      } else if (val1 < val2) {
        return -1;
      } else {
        return 0;
      }
    });

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
              <Link to="/openbill/sellinggoods">
                <Button style={{ float: 'right' }} type="primary">
                  开单
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Conditional
            operatorId={this.state.operatorId}
            queryReset={this.queryReset}
            rangeTime={this.state.rangeTime}
            employeeData={employeeData}
            queryData={this.queryData}
          />
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Statistics {...StatisticsMethods} />
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Table
            className={commonStyle.tableAdaption}
            expandedRowRender={this.expandedRowRender}
            onExpand={(expanded,record)=>this.onExpand(expanded, record)}
            // onExpandedRowsChange={this.expandedRows}
            expandedRowKeys={this.state.expandesRowKey}
            loading={loading}
            columns={columns}
            dataSource={salesData}
            rowKey={record => record.id}
            locale={{ emptyText: '暂无销售单据' }}
            pagination={{
              current: this.state.current,
              total: this.state.salesTotal,
              defaultPageSize: 10,
              onChange: page => {
                this.props.dispatch({
                  type: 'openbill/fetchSales', // 获取销售单据
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
        {/* 设置表头信息 */}
        <Modal
          title="列表设置"
          visible={this.state.settingVisible}
          onOk={this.settingOk}
          okText="保存"
          onCancel={this.settingCancel}
        >
          <CheckboxGroup
            style={{ width: '100%' }}
            onChange={this.onCheckChange}
            value={checkedValue}
          >
            <Row>{checkboxAllData}</Row>
          </CheckboxGroup>
        </Modal>
        <SalesUpdate visible={this.state.updateVisible} {...updateSalesMethods} />
      </div>
    );
  }
}
export default SalesSlip