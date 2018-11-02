import React, { Component } from 'react';
import { connect } from 'dva';

import moment from 'moment';
import { Row, Col, Select, Form, Card,DatePicker, Button, Input, InputNumber, message } from 'antd';
import SupplierModal from '@/components/SupplierSelect';
import styles from './index.less';
import commonStyle from '../../global.less'; // 公共样式

const { Option } = Select;
const { TextArea } = Input;

@connect(({ openbill, store, loading }) => ({
  openbill,
  store,
  loading: loading.models.openbill,
}))
@Form.create()
class Purchasepayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNum: '',
      orderTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 订单时间
      supplierVisible: false,
      supplierName: props.location.state ? props.location.state.name : '　',
      supplierId: props.location.state ? props.location.state.id : null,
      payMethod: '现金',
      payMethodPost: 1,
      pay: 0, // 付款
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchPayNum', // 订单号
    });
    dispatch({
      type: 'store/fetchEmployee', // 员工列表
    });
  }

  // props 改变时调用
  componentWillReceiveProps(nextProps) {
    if (nextProps.openbill !== this.props.openbill) {
      this.setState({
        orderNum: nextProps.openbill.orderNum,
      });
    }
  }
  
  /**
   * 选择操作员
   */
  selectOperator = e => {
    this.setState({
      operatorId: e,
    });
  };

  /**
   * 订单日期选择
   */
  orderTime = dateString => {
    const tmp = dateString.format('YYYY-MM-DD');

    this.setState({
      orderTime: tmp,
    });
  };

  /**
   * 不能选择的日期
   */
  disabledDate = current => {
    return current > moment().endOf('day');
  };

  /**
   * 显示选择供应商
   */
  showSupplier = () => {
    this.setState({
      supplierVisible: true,
    });
  };

  /**
   * 关闭选择供应商
   */
  closeSupplier = () => {
    this.setState({
      supplierVisible: false,
    });
  };

  /**
   * 点击行选择供应商
   */
  selectCust = value => {
    if (value.pay === 0) {
      message.error('未欠款');

      return;
    }

    this.setState({
      supplierName: value.name,

      supplierId: value.id, // 供应商ID

      supplierPay: value.pay,

      supplierVisible: false,
    });
  };

  // 退款方式
  payMet = value => {
    this.setState({
      payMethodPost: value.key,
      payMethod: value.label,
    });
  };

  // 付款
  payChange = e => {
    this.setState({
      pay: e,
    });
  };

  /**
   * 备注
   */
  changeRemarks = e => {
    this.setState({
      remarks: e.target.value,
    });
  };

  /**
   * 保存
   */
  save = () => {
    const {
      pay,
      supplierName,
      orderNum,
      operatorId,
      orderTime,
      payMethodPost,
      supplierId,
      remarks,
    } = this.state;
    if(!operatorId){
      message.warning('请选择操作员');
      return;
    }
    if (!supplierId) {
      message.error('请选择供应商！');
      return;
    }
    if(pay===0 || !pay){
      message.error('请输入欠款金额！');
      return;
    }

    const payload = {
      pay,
      pay_method: payMethodPost, // 支付方式
      order_id: orderNum, // 订单号
      operator_id: operatorId, // 操作员
      order_date: orderTime, // 订单时间
      supplier_id: supplierId, // 供应商ID
      supplier_name: supplierName,
      remarks,
    };
    this.props.dispatch({
      type: 'openbill/addPayment', // 订单号
      payload,
      callback: res => {
        if (res.errcode) message.error(res.msg);
        else {
          message.success(res.msg);
          this.props.dispatch({
            type: 'openbill/fetchPayNum', // 收款订单号
          });
          this.props.dispatch({
            type: 'supplier/supplierinf', // 供应商列表
            payload: {
              page: 1,
            },
          });
          this.setState({
            supplierPay:0,
            pay: 0,
            payMethodPost: 1,
            payMethod: '现金',
            supplierId: 1,
            supplierName: '零散供应商',
            remarks: '',
          });
        }
      },
    });
    // console.log(payload);
  };

  render() {
    const { store } = this.props;
    const { employeeData } = store;

    // 选择供应商 props
    const supplierMethods = {
      closeSupplier: this.closeSupplier,
      selectCust: this.selectCust,
    };

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
    // 如有欠款显示
    const Pay = () => {
      if (!this.state.supplierPay) {
        return null;
      }
      return <span style={{ color: 'red' }}> 欠款:{this.state.supplierPay}</span>;
    };

    return (
      <div>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={8}>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>单　　号: </span>
              <span className={styles.orderNum}>{this.state.orderNum}</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>操&nbsp;&nbsp;作&nbsp;&nbsp;员: </span>
              <Select style={{ width: 130 }} onChange={this.selectOperator}>
                {eeOption}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>订单日期: </span>
              <DatePicker
                allowClear={false}
                style={{ width: 130 }}
                defaultValue={moment()}
                onChange={this.orderTime}
                disabledDate={this.disabledDate}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>供&nbsp;&nbsp;应&nbsp;&nbsp;商: </span>
              <Button onClick={this.showSupplier} style={{ width: '130px' }}>
                {this.state.supplierName}
              </Button>
              <Pay />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={4} style={{ marginTop: 5 }}>
              <Button type="primary" onClick={this.save} style={{ width: '130px' }}>
                保存
              </Button>
            </Col>
          </Row>
        </Card>
        <SupplierModal {...supplierMethods} supplierVisible={this.state.supplierVisible} />
        <Card className={commonStyle.rowBackground}>
          <Row gutter={4}>
            <Col span={5}>
              <span>{this.state.payMethod}付款: </span>
              <InputNumber
                value={this.state.pay}
                onChange={this.payChange}
                step={0.01}
                style={{ width: 120 }}
              />
            </Col>
            <Col span={5}>
              <span>付款账户: </span>
              <Select
                labelInValue
                style={{ width: 130 }}
                defaultValue={{ key: 1 }}
                onChange={this.payMet}
              >
                <Option value={1} key={1}>
                  现金
                </Option>
                <Option value={2} key={2}>
                  银行存款
                </Option>
                <Option value={3} key={3}>
                  POS收银
                </Option>
                <Option value={4} key={4}>
                  微信
                </Option>
                <Option value={5} key={5}>
                  支付宝
                </Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ paddingTop: 10 }}>
            <Col span={10}>
              <TextArea
                onChange={this.changeRemarks}
                value={this.state.remarks}
                placeholder="备注(最多200字)"
                autosize={{ minRows: 6, maxRows: 6 }}
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
export default Purchasepayment