import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {
  Tag,
  Row,
  Icon,
  Col,
  Select,
  Form,
  DatePicker,
  Button,
  Input,
  InputNumber,
  message,
  Radio,
  Modal,
  Divider,
  Card,
  Popconfirm,
} from 'antd';

import SupplierModal from '@/components/SupplierSelect';
import CustomerModal from '@/components/CustomerSelect';
import styles from './index.less';
import commonStyle from '../../global.less'; // 公共样式

const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;

const InComeModal = props => {
  const {
    visible,
    handleCancel,
    addVisible,
    addhandleOk,
    addhandleCancel,
    updatevisible,
    updateDataIcon,
    inComeProjectUpdate,
    updatehandleOk,
    updatehandleCancel,
    iconUpdate,
    incomeTypeData,
    iconProjName,
    inComeProjectAdd,
    delProj,
    projName,
  } = props;

  const radio = incomeTypeData.map(index => (
    <Tag
      key={index.id}
      value={index}
      style={{ marginTop: 2, width: '130px', height: '32px' }}
      onClick={e => inComeProjectUpdate(e, index)}
    >
      <div style={{ paddingTop: '6px' }}>
        <Icon type={index.icon} theme="outlined" />&nbsp;{index.name}
      </div>
    </Tag>
  ));

  const iconList = [
    'star',
    'profile',
    'shop',
    'shopping-cart',
    'home',
    'coffee',
    'printer',
    'desktop',
    'hdd',
    'inbox',
    'laptop',
    'paper-clip',
    'heart',
    'car',
    'schedule',
    'gift',
    'wallet',
    'bank',
    'trophy',
    'global',
    'red-envelope',
    'tool',
    'hourglass',
    'message',
    'phone',
    'appstore',
  ];

  const list = iconList.map(index => (
    <Col span={3} key={index} style={{ marginTop: '5px' }}>
      <Button shape="circle" icon={index} onClick={key => iconUpdate(key, index)} />
    </Col>
  ));
  return (
    <Modal
      title="编辑支出项目"
      visible={visible}
      footer={<Button onClick={() => inComeProjectAdd()}>添加项目</Button>}
      onCancel={handleCancel}
    >
      {radio}
      <Modal
        title="编辑支出项目"
        visible={updatevisible}
        onOk={updatehandleOk}
        onCancel={updatehandleCancel}
      >
        <Row gutter={8}>
          <Col span={3}>
            <Button shape="circle">
              <Icon type={updateDataIcon} theme="outlined" />
            </Button>
          </Col>
          <Col span={8}>
            <Input
              onChange={iconProjName}
              placeholder="项目名称不超过5个字"
              value={projName}
              maxLength={5}
            />
          </Col>
          <Col span={8}>
            <Popconfirm title="是否要删除此项目？" onConfirm={() => delProj()}>
              <Button type="danger">删除</Button>
            </Popconfirm>
          </Col>
        </Row>
        <Divider orientation="left">选择需要更换的图标</Divider>
        <Row>{list}</Row>
      </Modal>
      <Modal
        title="新增支出项目"
        visible={addVisible}
        onOk={addhandleOk}
        onCancel={addhandleCancel}
      >
        <Row>
          <Col span={3}>
            <Button shape="circle">
              <Icon type={updateDataIcon} theme="outlined" />
            </Button>
          </Col>
          <Col span={8}>
            <Input
              onChange={iconProjName}
              value={projName}
              placeholder="项目名称不超过5个字"
              maxLength={5}
            />
          </Col>
        </Row>
        <Divider orientation="left">选择需要更换的图标</Divider>
        <Row>{list}</Row>
      </Modal>
    </Modal>
  );
};

@connect(({ product, openbill, customer, store, supplier, loading }) => ({
  product,
  openbill,
  customer,
  store,
  supplier,
  loading: loading.models.openbill,
}))
@Form.create()
class Otherexpenditure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNum: '', // 订单号
      employeeData: [], // 操作员
      orderTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 订单时间
      selectName: '　', // 客户名称
      customerVisible: false, // 客户列表Modal
      pay: 0,
      payMethod: '现金',
      payMethodPost: 1,
      inCome: 1,
      incomeVisible: false,
      updateData: {},
      idPayload: {},
      incomeTypeData: [],
      updateDataIcon: 'star',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchexpenditureTypeNum', // 订单号
    });
    dispatch({
      type: 'openbill/expenditureType', // 列表
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
        incomeTypeData: nextProps.openbill.incomeTypeData,
      });
    }

    if (nextProps.store !== this.props.store) {
      this.setState({
        employeeData: nextProps.store.employeeData,
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
    const tmp = dateString.format('YYYY-MM-DD HH:mm:ss');
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

  closeSupplier = () => {
    this.setState({
      supplierVisible: false,
    });
  };

  /**
   * 点击行选择
   */
  selectCust = value => {
    if ('customer_num' in value)
      this.setState({
        selectName: value.name,
        idPayload: {
          customer_name: value.name,
          customer_id: value.id,
          supplier_id: undefined,
        },
        customerVisible: false,
      });
    else if ('suppliers_num' in value) {
      this.setState({
        selectName: value.name,
        idPayload: {
          supplier_name: value.name,
          customer_id: undefined,
          supplier_id: value.id,
        },
        supplierVisible: false,
      });
    }
  };

  /**
   * 备注
   */
  fetchRemarks = e => {
    if (e.target.value.length >= 140) {
      message.error('备注最多不超过140字');
      return;
    }
    this.setState({
      remarks: e.target.value,
    });
  };

  // 支出方式
  payMet = value => {
    this.setState({
      payMethodPost: value.key,
      payMethod: value.label,
    });
  };

  // 支出
  payChange = e => {
    this.setState({
      pay: e,
    });
  };

  inComeProject = value => {
    this.setState({
      inCome: value.target.value,
    });
  };

  save = () => {
    if(!this.state.operatorId){
      message.warning('请选择操作员');
      return;
    }

    const payload = {
      order_id: this.state.orderNum,
      operator_id: this.state.operatorId,
      order_date: this.state.orderTime, // 订单时间
      customer_name: this.state.idPayload.customer_name,
      supplier_name: this.state.idPayload.supplier_name,
      customer_id: this.state.idPayload.customer_id,
      supplier_id: this.state.idPayload.supplier_id,
      pay: this.state.pay,
      pay_method: this.state.payMethodPost, // 支付方式
      remarks: this.state.remarks,
      icon_id: this.state.inCome, // 其他支出项目ID
    };
    this.props.dispatch({
      type: 'openbill/otherExpenditureSave',
      payload,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            selectName: '　', // 客户名称
            remarks: '',
            idPayload: {},
            pay: 0,
          });
          this.props.dispatch({
            type: 'openbill/fetchexpenditureTypeNum', // 订单号
          });
        }
      },
    });
    console.log(payload);
  };

  inComeModalShow = () => {
    this.setState({
      incomeVisible: true,
    });
  };

  incomeCancel = () => {
    this.setState({
      incomeVisible: false,
    });
  };

  inComeProjectAdd = () => {
    console.log('a');
    this.setState({
      addVisible: true,
    });
  };

  addhandleCancel = () => {
    this.setState({
      addVisible: false,
      updateData: '',
      updateDataIcon: 'star',
    });
  };

  iconProjName = e => {
    console.log(e.target.value);
    this.setState({
      projName: e.target.value,
    });
  };

  addhandleOk = () => {
    this.props.dispatch({
      type: 'openbill/addExpenditureType',
      payload: {
        icon: this.state.updateDataIcon,
        name: this.state.projName,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.props.dispatch({
            type: 'openbill/expenditureType', // 列表
          });
          this.setState({
            addVisible: false,
            incomeVisible: false,
            updateData: '',
            updateDataIcon: 'star',
            projName: '',
          });
        }
      },
    });
    console.log(this.state.updateDataIcon);
    console.log(this.state.projName);
  };

  updatehandleOk = () => {
    this.props.dispatch({
      type: 'openbill/updateExpenditureType',
      payload: {
        id: this.state.updateData.id,
        icon: this.state.updateDataIcon,
        name: this.state.projName,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.props.dispatch({
            type: 'openbill/expenditureType', // 列表
          });
          this.setState({
            updatevisible: false,

            incomeVisible: false,
            updateData: '',
            updateDataIcon: 'star',
            projName: '',
          });
        }
      },
    });
    console.log(this.state.updateDataIcon);
    console.log(this.state.projName);
  };

  delProj = () => {
    const { id } = this.state.updateData;
    this.props.dispatch({
      type: 'openbill/delExpenditureType',
      payload: {
        id,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.props.dispatch({
            type: 'openbill/expenditureType', // 列表
          });
          this.setState({
            updatevisible: false,

            updateData: '',
            updateDataIcon: 'star',
            projName: '',
          });
        }
      },
    });
  };

  inComeProjectUpdate = (e, value) => {
    console.log(value);
    this.setState({
      updateData: value,
      projName: value.name,
      updateDataIcon: value.icon,
      updatevisible: true,
    });
  };

  updatehandleCancel = () => {
    this.setState({
      updatevisible: false,
      updateData: '',
      updateDataIcon: 'star',
    });
  };

  iconUpdate = (e, value) => {
    console.log(value);
    this.setState({
      updateDataIcon: value,
    });
  };

  showCompany = () => {
    this.setState({
      companyVisible: true,
    });
  };

  cancel = () => {
    this.setState({
      companyVisible: false,
    });
  };

  render() {
    const {
      incomeTypeData,
      orderNum,
      employeeData,

      // supplierData,
      // categoryData,
    } = this.state;

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

    // 选择客户 props
    const customerMethods = {
      closeCustomer: this.closeCustomer,
      selectCust: this.selectCust,
    };
    // 选择供应商 props
    const supplierMethods = {
      closeSupplier: this.closeSupplier, // 关闭
      selectCust: this.selectCust, // 点击行选择供应商
    };
    // console.log(incomeTypeData)
    const radio = incomeTypeData.map(index => (
      <Radio.Button style={{ marginTop: 2, width: '130px' }} key={index.id} value={index.id}>
        <Icon type={index.icon} theme="outlined" />&nbsp;{index.name}
      </Radio.Button>
    ));

    const incomeMethods = {
      addhandleOk: this.addhandleOk,
      addhandleCancel: this.addhandleCancel,
      addVisible: this.state.addVisible,
      inComeProjectAdd: this.inComeProjectAdd,
      handleCancel: this.incomeCancel,
      updatevisible: this.state.updatevisible,
      incomeTypeData,
      updateData: this.state.updateData,
      updateDataIcon: this.state.updateDataIcon,
      iconProjName: this.iconProjName,
      inComeProjectUpdate: this.inComeProjectUpdate,
      updatehandleCancel: this.updatehandleCancel,
      iconUpdate: this.iconUpdate, // 图标更新
      updatehandleOk: this.updatehandleOk,
      delProj: this.delProj,
      projName: this.state.projName,
    };

    return (
      <div>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={8}>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>单　　号: </span>
              <span className={styles.orderNum}>{orderNum}</span>
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
              <span>来往单位: </span>
              {/* <Button onClick={this.showCustomer} style={{ width: '130px' }}>
                {this.state.customerName}
              </Button> */}
              <Button onClick={this.showCompany} style={{ width: '130px' }}>
                {this.state.selectName}
              </Button>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={{ span: 4 }} style={{ marginTop: 5 }}>
              <Link to="/salesDetails/returnForm" style={{ marginRight: 5 }}>
                <Button type="primary">销售明细</Button>
              </Link>
              <Button type="primary" onClick={this.save}>
                保存
              </Button>
            </Col>
          </Row>
        </Card>

        <CustomerModal {...customerMethods} customerVisible={this.state.customerVisible} />
        <SupplierModal {...supplierMethods} supplierVisible={this.state.supplierVisible} />
        <Card className={commonStyle.rowBackground}>
          <Row gutter={4}>
            <Col xs={24} sm={24} md={12} lg={5} xl={5}>
              <span>{this.state.payMethod}支出: </span>
              <InputNumber
                value={this.state.pay}
                onChange={this.payChange}
                step={0.01}
                style={{ width: 120 }}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={5} xl={5}>
              <span>支出账户: </span>
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
          <Row gutter={4} style={{ marginTop: '15px' }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <span style={{ lineHeight: '32px' }}>支出项目: </span>
              <Radio.Group
                defaultValue={this.state.inCome}
                onChange={this.inComeProject}
                buttonStyle="solid"
              >
                {radio}
              </Radio.Group>
              <Button
                style={{ marginTop: 5 }}
                shape="circle"
                icon="plus"
                onClick={this.inComeModalShow}
              />
              <InComeModal visible={this.state.incomeVisible} {...incomeMethods} />
            </Col>
          </Row>
          <Row gutter={8} style={{ marginTop: '10px' }}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <TextArea
                placeholder="备注(最多140字)"
                maxLength={140}
                onChange={this.fetchRemarks}
                autosize={{ minRows: 4, maxRows: 4 }}
              />
            </Col>
          </Row>
        </Card>
        <Modal
          title="来往单位"
          visible={this.state.companyVisible}
          onCancel={this.cancel}
          footer={null}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Card
                hoverable
                onClick={() => {
                  this.setState({
                    customerVisible: true,
                    companyVisible: false,
                  });
                }}
              >
                <Meta
                  avatar={<Icon type="user" theme="outlined" style={{ fontSize: '20px' }} />}
                  title="客户"
                  description="选择客户"
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Card
                hoverable
                onClick={() => {
                  this.setState({
                    supplierVisible: true,
                    companyVisible: false,
                  });
                }}
              >
                <Meta
                  avatar={<Icon type="user" theme="outlined" style={{ fontSize: '20px' }} />}
                  title="供应商"
                  description="选择供应商"
                />
              </Card>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
export default Otherexpenditure