import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Input,
  Table,
  Row,
  Col,
  Modal,
  Form,
  Select,
  Card,
  message,
  Popconfirm,
  Divider,
  DatePicker,
  InputNumber,
  Icon,
} from 'antd';
import stylesaa from './ProductList.less';
import styles from './ProductLoss.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

// 添加报损Modal
const CreateLossEmpForm = Form.create()(props => {
  const {
    modalVisibleLoss,
    form,
    Cancel,
    initialValueLoss,
    causeOfLossData,
    handleLossModal,
  } = props;
  const cancel = () => {
    form.resetFields();
    Cancel();
  };
  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleLossModal(fieldsValue);
    });
  };
  console.log(initialValueLoss);
  let goodsName = '';
  if (initialValueLoss.length !== 0) {
    goodsName = initialValueLoss.goods.name;
  }
  return (
    <Modal
      title="修改报损"
      visible={modalVisibleLoss}
      onOk={handleOk}
      onCancel={cancel}
      width={400}
    >
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="货品名称">
        {form.getFieldDecorator('name', {
          initialValue: goodsName,
        })(<Input placeholder="请输入货品名称" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="货品数量">
        {form.getFieldDecorator('number', {
          rules: [
            { required: true, message: '货品数量不能为空' },
            {
              validator(rule, values, callback) {
                if (values > initialValueLoss.stock) {
                  callback('报损数量大于库存数量！！！');
                } else callback();
              },
            },
          ],
          initialValue: initialValueLoss.number,
        })(<InputNumber />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="报损原因">
        {form.getFieldDecorator('loss_id', {
          rules: [{ required: true, message: '请选择报损原因' }],
          initialValue: initialValueLoss.loss_id,
        })(
          <Select style={{ width: 220 }}>
            {causeOfLossData.map(id => {
              return (
                <Option key={id.id} value={id.id}>
                  {id.reason}
                </Option>
              );
            })}
          </Select>
        )}
      </FormItem>
      <Icon type="plus-circle-o" className={styles.addLoss} />
    </Modal>
  );
});

@connect(({ product, store, loading }) => ({
  product,
  store,
  loading: loading.models.product,
}))
export default class ReportLoss extends Component {
  state = {
    emplySelectValue: 'all',
    lossSelectValue: 'all',
    initialValueLoss: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/reportLossinf', // 报损查询
    });
    dispatch({
      type: 'product/causeoflossinf', // 报损原因
    });
    // dispatch({
    //   type: 'product/productListind', // 货品列表
    //   payload: {
    //     page: 1,
    //   },
    // });
    dispatch({
      type: 'store/fetchEmployee', // 员工查询
    });
  }
  // props 改变时调用
  componentWillReceiveProps() {
    this.setState({
      reportLossData: this.props.product.reportLossData,
    });
  }

  timeMatch = (date, dateString) => {
    dateString[0] = new Date(dateString[0]).getTime();
    dateString[1] = new Date(dateString[1]).getTime();
    // 设置时间范围
    this.setState({
      rangeTime: date, // 给重置用
      RangeTime: dateString,
    });
  };
  eeMatch = e => {
    // 设置报损员条件
    this.setState({
      emplySelectValue: e,
    });
  };
  lossMatch = e => {
    // 设置报损原因条件
    this.setState({
      lossSelectValue: e,
    });
  };
  nameMatch = e => {
    // 设置名称条件
    this.setState({
      TextSearch: e.target.value,
    });
  };

  // 添加报损
  addLoss = () => {
    this.setState({
      modalVisibleLoss: true,
    });
  };
  // 返回
  Cancel = () => {
    this.setState({
      modalVisibleLoss: false,
    });
  };

  handleLossModal = fields => {
    console.log(fields);
  };
  // 删除报损
  del = dId => {
    this.props.dispatch({
      type: 'product/reportLossdel',
      payload: {
        id: dId,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success('更新成功');
          const sourceData = this.props.product.reportLossData;
          for (let i = 0; i < sourceData.length; i += 1) {
            if (dId === sourceData[i].id) {
              this.props.product.reportLossData.splice(i, 1);
            }
          }
        }
      },
    });
  };
  // 修改报损
  update = record => {
    this.setState({
      initialValueLoss: record,
      modalVisibleLoss: true,
    });
  };
  /**
   * RangeTime Array 时间范围
   * TextSearch String 搜索名称
   * reportLossData Array 报损列表
   */
  search = () => {
    const DataProps = this.props.product.reportLossData;
    const { RangeTime, TextSearch, emplySelectValue, lossSelectValue } = this.state;
    let resultData = DataProps;
    // 报损员条件
    if (emplySelectValue !== 'all') {
      resultData = resultData.filter(record => {
        return emplySelectValue === record.user_id;
      });
    }
    // 报损原因条件
    if (lossSelectValue !== 'all') {
      resultData = resultData.filter(record => {
        return lossSelectValue === record.loss_id;
      });
    }
    // 名称条件 存在
    if (TextSearch) {
      const reg = new RegExp(TextSearch, 'gi');
      resultData = resultData
        .map(record => {
          const match = record.goods.name.match(reg);
          if (!match) {
            return null;
          }
          return { ...record };
        })
        .filter(record => !!record);
    }
    // 时间条件 存在
    if (RangeTime && !isNaN(RangeTime[0]) && !isNaN(RangeTime[1])) {
      resultData = resultData.filter(record => {
        const dateArray = record.created_at.split(' ');
        const date = new Date(dateArray[0]).getTime();
        return date >= RangeTime[0] && date <= RangeTime[1];
      });
    }

    this.setState({
      reportLossData: resultData,
    });
  };
  reset = () => {
    this.setState({
      emplySelectValue: 'all',
      lossSelectValue: 'all',
      rangeTime: [],
      TextSearch: '',
      reportLossData: this.props.product.reportLossData,
    });
  };
  render() {
    const { loading, product, store } = this.props;
    const { employeeData } = store;
    const { causeOfLossData } = product;
    const {
      modalVisibleLoss,
      initialValueLoss,
      reportLossData,
      emplySelectValue,
      lossSelectValue,
    } = this.state;
    // 报损人员列表 select
    const employeeOption = [];
    employeeOption.push(
      employeeData.map(fields => {
        return (
          <Option value={fields.id} key={fields.id}>
            {fields.name}
          </Option>
        );
      })
    );
    // 报损原因列表 select
    const causeOfLossOption = [];
    causeOfLossOption.push(
      causeOfLossData.map(fields => {
        return (
          <Option value={fields.id} key={fields.id}>
            {fields.reason}
          </Option>
        );
      })
    );
    let cl = 0;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: () => {
          return ++cl;
        },
      },
      {
        title: '规格',
        dataIndex: 'goods.spece',
        key: 'goods.spece',
      },
      {
        title: '单位',
        dataIndex: 'goods.unit.name',
        key: 'goods.unit.name',
      },
      {
        title: '货品名称',
        dataIndex: 'goods.name',
        key: 'goods.name',
      },
      {
        title: '报损前库存',
        dataIndex: 'old_stock',
        key: 'old_stock',
      },
      {
        title: '报损后库存',
        dataIndex: 'new_stock',
        key: 'new_stock',
      },
      {
        title: '损失成本',
        dataIndex: 'loss_money',
        key: 'loss_money',
      },
      {
        title: '报损数量',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '报损原因',
        dataIndex: 'reason.reason',
        key: 'reason.reason',
      },
      {
        title: '报损员',
        dataIndex: 'user.name',
        key: 'user.name',
      },
      {
        title: '报损日期',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          return (
            <span>
              <a style={{ color: '#FFC125' }} onClick={() => this.update(record)}>
                修改
              </a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.del(record.id)}>
                <a style={{ color: '#FF4500' }}>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    const lossMethods = {
      Cancel: this.Cancel,
      initialValueLoss,
      causeOfLossData,
    };
    return (
      <div>
        <div className={stylesaa.productListtop}>
          <Row gutter={8}>
            <Col span={4} className={styles.Textitle}>
              <span>报损人员:</span>
              <Select value={emplySelectValue} style={{ width: 120 }} onChange={this.eeMatch}>
                <Option value="all">全部</Option>
                {employeeOption}
              </Select>
            </Col>
            <Col span={4} className={styles.Textitle}>
              <span>报损原因:</span>
              <Select value={lossSelectValue} style={{ width: 120 }} onChange={this.lossMatch}>
                <Option value="all">全部</Option>
                {causeOfLossOption}
              </Select>
            </Col>
            <Col span={5} className={styles.Textitle}>
              <span>货品名称:</span>
              <Search
                placeholder="搜索货品名称"
                value={this.state.TextSearch}
                onChange={this.nameMatch}
                style={{ width: 160 }}
              />
            </Col>
            <Col span={8} className={styles.Textitle}>
              <span>日期:</span>
              <RangePicker
                value={this.state.rangeTime}
                showTime={{ format: 'HH:mm' }}
                onChange={this.timeMatch}
              />
            </Col>
            <Col span={3} className={styles.Textitle}>
              <Button type="primary" onClick={() => this.search()}>
                查询
              </Button>
              <Button type="primary" onClick={() => this.reset()}>
                重置
              </Button>
            </Col>
          </Row>
        </div>
        <Card>
          <Table
            dataSource={reportLossData}
            columns={columns}
            rowKey={record => record.id}
            locale={{ emptyText: '暂无报损' }}
            loading={loading}
          />
        </Card>
        <CreateLossEmpForm {...lossMethods} modalVisibleLoss={modalVisibleLoss} />
      </div>
    );
  }
}
