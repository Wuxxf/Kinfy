import React, { Component } from 'react';
import { connect } from 'dva';

import moment from 'moment';
import { Row, Col, Select, Form, DatePicker, Button, Input, InputNumber, message,Modal } from 'antd';
import SupplierModal from '@/components/SupplierSelect';
import commonStyle from '../../global.less'; // 公共样式

const { Option } = Select;
const { TextArea } = Input;

@connect(({ openbill, store, loading }) => ({
  openbill,
  store,
  loading: loading.models.openbill,
}))
@Form.create()
class PaymentUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierVisible: false,
      payMethod: '现金',
      payMethodPost: 1,
      pay: 0, // 付款
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'store/fetchEmployee', // 员工列表
    });
  }

  // props 改变时调用
  componentWillReceiveProps(nextProps) {
      
    if (nextProps.updateData !== this.props.updateData) {
      this.setState({
        id:nextProps.updateData.id,
        orderNum: nextProps.updateData.order_id,
        operatorId: nextProps.updateData.operator_id,
        orderTime:nextProps.updateData.order_date,
        supplierName:nextProps.updateData.supplier.name,
        supplierId:nextProps.updateData.supplier_id,
        pay:nextProps.updateData.pay,
        remarks:nextProps.updateData.remarks,
      });
      if (nextProps.updateData.pay_method === 2) {
        this.setState({
          payMethodPost: 2, // 支付账户(Int)
          payMethod: '银行存款', // 支付账户(String)
        });
      } else if (nextProps.updateData.pay_method === 3) {
        this.setState({
          payMethodPost: 3, // 支付账户(Int)
          payMethod: 'POS收银', // 支付账户(String)
        });
      } else if (nextProps.updateData.pay_method === 4) {
        this.setState({
          payMethodPost: 4, // 支付账户(Int)
          payMethod: '微信', // 支付账户(String)
        });
      } else if (nextProps.updateData.pay_method === 5) {
        this.setState({
          payMethodPost: 5, // 支付账户(Int)
          payMethod: '支付宝', // 支付账户(String)
        });
      }
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
      id,
      pay,
      supplierName,
      orderNum,
      operatorId,
      orderTime,
      payMethodPost,
      supplierId,
      remarks,
    } = this.state;
    if (!supplierId) {
      message.error('请选择供应商！');
      return;
    }

    const payload = {
        id,
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
      type: 'openbill/updatePayment', 
      payload,
      callback: res => {
        if (res.errcode) message.error(res.msg);
        else {
          message.success(res.msg);
          this.props.callback();
        }
      },
    });
    console.log(payload);
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
      <Modal
        title="编辑付款单据"
        visible={this.props.visible}
        destroyOnClose={true}
        // onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        width={1200}
        footer={null}
      >
        <div className={commonStyle.rowBackground}>
          <Row gutter={8}>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>单　　号: </span>
              <span>{this.state.orderNum}</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>操&nbsp;&nbsp;作&nbsp;&nbsp;员: </span>
              <Select defaultValue={8} style={{ width: 130 }} onChange={this.selectOperator}>
                {eeOption}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>订单日期: </span>
              <DatePicker
                style={{ width: 130 }}
                defaultValue={moment(this.state.orderTime)}
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
        </div>
        <SupplierModal {...supplierMethods} supplierVisible={this.state.supplierVisible} />
        <div className={commonStyle.rowBackground}>
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
                value={this.state.remarks}
                onChange={this.changeRemarks}
                placeholder="备注(最多200字)"
                autosize={{ minRows: 5, maxRows: 10 }}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}
export default PaymentUpdate