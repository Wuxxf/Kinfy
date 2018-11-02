import React, { Component } from 'react';
import { connect } from 'dva';

import moment from 'moment';
import { Row,Modal, Col, Select, Form, DatePicker, Button, Input, InputNumber, message } from 'antd';
import CustomerModal from '@/components/CustomerSelect';
// import styles from './index.less';
import commonStyle from '../../global.less'; // 公共样式

const { Option } = Select;
const { TextArea } = Input;

@connect(({ openbill, store, loading }) => ({
  openbill,
  store,
  loading: loading.models.openbill,
}))
@Form.create()
class ReceiptUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerVisible: false,
      payMethod: '现金',
      payMethodPost: 1,
      pay: 0, // 收款
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
        operatorId:nextProps.updateData.operator_id,
        orderTime:nextProps.updateData.order_date,
        customerName:nextProps.updateData.customer.name,
        customerId:nextProps.updateData.customer_id,
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
   * 显示选择客户
   */

  showCustomer = () => {
    this.setState({
      customerVisible: true,
    });
  };

  /**
   * 关闭选择客户
   */
  closeCustomer = () => {
    this.setState({
      customerVisible: false,
    });
  };

  /**
   * 点击行选择客户
   */

  selectCust = value => {
    if (value.pay === 0) {
      message.error('当前客户未欠款');

      return;
    }

    this.setState({
      customerName: value.name,

      customerId: value.id, // 客户ID

      customerPay: value.pay,

      customerVisible: false,
    });
  };

  // 收款方式
  payMet = value => {
    this.setState({
      payMethodPost: value.key,
      payMethod: value.label,
    });
  };

  // 收款
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
      orderNum,
      operatorId,
      orderTime,
      customerName,
      payMethodPost,
      customerId,
      remarks,
      id,
    } = this.state;
    if (!customerId) {
      message.error('请选择客户！');
      return;
    }

    const payload = {
      id,
      pay,
      pay_method: payMethodPost, // 支付方式
      order_id: orderNum, // 订单号
      operator_id: operatorId, // 操作员
      order_date: orderTime, // 订单时间
      customer_id: customerId, // 客户ID
      customer_name: customerName, // 客户名
      remarks,
    };

    this.props.dispatch({
      type: 'openbill/updateReceipt',
      payload,
      callback: res => {
        if (res.errcode) message.error(res.msg);
        else {
          message.success(res.msg);
          this.props.callback();
        }
      },
    });

  };

  render() {
    const { store } = this.props;
    const { employeeData } = store;

    // 选择客户 props
    const customerMethods = {
      closeCustomer: this.closeCustomer,
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
      if (!this.state.customerPay) {
        return null;
      }
      return <span style={{ color: 'red' }}> 欠款:{this.state.customerPay}</span>;
    };

    return (
      <Modal
        title="编辑收款单"
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
              <span>客　　户: </span>
              <Button onClick={this.showCustomer} style={{ width: '130px' }}>
                {this.state.customerName}
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
        <CustomerModal {...customerMethods} customerVisible={this.state.customerVisible} />
        <div className={commonStyle.rowBackground}>
          <Row gutter={4}>
            <Col span={5}>
              <span>{this.state.payMethod}收款: </span>
              <InputNumber
                value={this.state.pay}
                onChange={this.payChange}
                step={0.01}
                style={{ width: 120 }}
              />
            </Col>
            <Col span={5}>
              <span>收款账户: </span>
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
                maxLength={200}
                autosize={{ minRows: 6, maxRows: 6 }}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}
export default ReceiptUpdate