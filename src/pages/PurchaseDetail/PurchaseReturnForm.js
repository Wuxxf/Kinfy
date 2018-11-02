import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Form,
  Icon,
  Modal,
  Input,
  Table,
  Select,
  Button,
  Divider,
  message,
  Checkbox,
  Popconfirm,
  DatePicker,
  Card,
} from 'antd';


import PurchasingReturnUpdate from '@/components/PurchasingReturnUpdate';
import TimeSelection from '@/components/TimeSelection';
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
    // fixed: 'left' ,
    width: 75,
  },
  {
    index: 1,
    title: '订单号',
    dataIndex: 'order_id',
    key: 'order_id',
    // fixed: 'left' ,
    width: 140,
  },
  {
    index: 2,
    title: '供应商',
    dataIndex: 'supplier.name',
    key: 'supplier.name',
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
    title: '状态 ',
    dataIndex: 'state',
    key: 'state',
  },
  {
    index: 6,
    title: '原价',
    dataIndex: 'total_price',
    key: 'total_price',
  },
  {
    index: 7,
    title: '折后价 ',
    dataIndex: 'total_price_final',
    key: 'total_price_final',
  },
  {
    index: 8,
    title: '实付',
    dataIndex: 'pay',
    key: 'pay',
  },

  {
    index: 9,
    title: '总数',
    dataIndex: 'number',
    key: 'number',
  },
  {
    index: 10,
    title: '退款账户',
    dataIndex: 'pay_method',
    key: 'pay_method',
  },
  {
    index: 11,
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
  },
];

// 本地存储 表头信息
if (localStorage.getItem('PurchasingReturnColumns') === null) {
  const tmp = columnsAll.slice(0, 5);

  // 存数组 转String
  localStorage.setItem('PurchasingReturnColumns', JSON.stringify(tmp));
}
const checkedLocal = JSON.parse(localStorage.getItem('PurchasingReturnColumns'));

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
  const { form, queryData, rangeTime, employeeData } = props;

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
          label="供应商查询"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('supplier_name', {})(<Input placeholder="请输入供应商名称" />)}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="操作员"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('employee_name', {
            initialValue: 8,
          })(<Select style={{ width: '100%' }}>{eeOption}</Select>)}
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
      <Col
        xs={24}
        sm={12}
        md={12}
        lg={12}
        xl={5}
        style={{ margin: '5px 0 5px 0', textAlign: 'center' }}
      >
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
class ShippingOrder extends Component {
  state = {
    purchasingData: [], // 销售数据单据
    rangeTime: [
      moment(`${thisYear}-${thisMonth}`),
      moment(`${thisYear}-${thisMonth}-${daysInMonth}`),
    ],

    settingVisible: false, // 表头设置Modal
    checkedValue: checkedLocal, // 多选框的选中

    employeeData: [], // 操作员(员工)
    expandesRowData: [], //  详情数据
    expandesRowKey: [], // 展开的行
    updateVisible: false, // 更新Modal
    current: 1, // 当前页数

    buttonStyles: 'primary', // 控制点击查询时 时间按钮样式
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchPurchReturn', // 获取单据
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.openbill !== this.props.openbill) {
      const tableDate = nextProps.openbill.purchasingData;
      const tableDateLength = tableDate.length;
      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.openbill.dataFrom + i;
      }
      this.setState({
        purchasingData: tableDate,
        dataTotal: nextProps.openbill.dataTotal,
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
      type: 'openbill/fetchPurchReturn', // 获取销售单据
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
   *
   */
  onCheckChange = checkedValues => {
    if (checkedValues.length >= 5) {
      const tmp = [];

      for (let i = 0; i < checkedValues.length; i++) {
        tmp.push(JSON.parse(checkedValues[i]));
      }

      // 存数组 转String

      localStorage.setItem('PurchasingReturnColumns', JSON.stringify(tmp));
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

  // 展开行变化时 调用
  expandedRows = e => {
    if (e.length === 0) {
      this.setState({
        expandesRowKey: e,
      });
    }
    if (e.length > 1) {
      e.shift();
    }
    if (e.toString() !== this.state.expandesRowKey.toString() && e.length !== 0) {
      this.props.dispatch({
        type: 'openbill/queryPurchReturnDetail',
        payload: {
          id: e[0],
        },
        callback: res => {
          if (res.errcode) {
            message.error('不好！好像出错了！');
          } else {
            this.setState(
              {
                expandesRowData: res.data[0].info,
                expandesRowKey: e,
              },
              () => {
                this.setState({
                  expandesRowKey: e,
                });
                // console.log(res.data)
              }
            );
          }
        },
      });
    }
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
    delete fields.order_date;

    this.props.dispatch({
      type: 'openbill/fetchPurchReturn', // 获取单据
      payload: fields,
    });

    console.log(fields);
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
      type: 'openbill/fetchPurchReturn', // 获取销售单据
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
      type: 'openbill/queryPurchReturnDetail',
      payload: {
        id: e.id,
      },
      callback: res => {
        if (res.errcode) {
          message.error('不好！好像出错了！');
        } else {
          this.setState({
            // expandesRowData: res.data[0].info,
            updateVisible: true,
            updateData: res.data[0],
            // expandesRowKey:e,
          });
        }
      },
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
      type: 'openbill/fetchPurchReturn', // 获取单据
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
    const { purchasingData, rangeTime } = this.state;
    const salesLength = purchasingData.length;
    const start = rangeTime[0].format('YYYY-MM-DD HH:mm:ss');
    const end = rangeTime[1].format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'openbill/delPurchReturn',
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
              type: 'openbill/fetchPurchReturn',
              payload: {
                start,
                end,
                page: this.state.current - 1,
              },
            });
          else
            dispatch({
              type: 'openbill/fetchPurchReturn',
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
  printingSales = () => {
    console.log('暂时木有打印这功能');
  };

  render() {
    const { loading } = this.props;
    const { purchasingData, buttonStyles, employeeData, checkedValue } = this.state;

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
      width: 160,
      render: record => {
        return (
          <span>
            <a onClick={() => this.updateSales(record)} style={{ color: '#FFC125' }}>
              修改
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.printingSales()} style={{ color: '#1890ff' }}>
              打印
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
    columns = JSON.parse(localStorage.getItem('PurchasingReturnColumns'));
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].dataIndex === 'pay_method')
        columns[i].render = (record) => {
          if(record===1)  return '现金';
          else if(record === 2) return '银行存款';
          else if(record === 3) return 'POS收银';
          else if(record === 4) return '微信';
          else if(record === 5) return '支付宝';
        };
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
              <Link to="/salesDetails/returnForm">
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
            employeeData={employeeData}
            queryData={this.queryData}
            queryReset={this.queryReset}
          />
        </Card>

        <Card className={commonStyle.rowBackground}>
          <Table
            // bordered={true}
            // scroll={{ x: 1300 }}
            className={commonStyle.tableAdaption}
            expandedRowRender={this.expandedRowRender}
            onExpandedRowsChange={this.expandedRows}
            expandedRowKeys={this.state.expandesRowKey}
            loading={loading}
            columns={columns}
            dataSource={purchasingData}
            rowKey={record => record.id}
            locale={{ emptyText: '暂无销售单据' }}
            pagination={{
              current: this.state.current,
              total: this.state.dataTotal,
              defaultPageSize: 10,
              onChange: page => {
                this.props.dispatch({
                  type: 'openbill/fetchPurchReturn', // 获取销售单据
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
        <PurchasingReturnUpdate visible={this.state.updateVisible} {...updateSalesMethods} />
      </div>
    );
  }
}
export default ShippingOrder