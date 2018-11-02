import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import { Link } from 'dva/router';
import {
  Tag,
  Row,
  Col,
  Select,
  Form,
  DatePicker,
  Button,
  Input,
  Card,
  Table,
  InputNumber,
  // Checkbox,
  Divider,
  message,
  Tooltip,
  Modal,
  Icon,
  Popconfirm,
} from 'antd';

import OtherIncomeAndPay from '@/components/OtherIncomeAndPay';
import AddGoods from '@/components/ProductSelect';
import CustomerModal from '@/components/CustomerSelect';
import styles from './inde.less';
import commonStyle from '../../global.less'; // 公共样式

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

const { CheckableTag } = Tag;
const FormItem = Form.Item;

// // 本地存储 是否默认不支付
// if (localStorage.getItem('defaultPay') === null) {
//   // 0 不打勾
//   localStorage.setItem('defaultPay', 0);
// }

const rules = [{ pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '请输入正确金额' }];
// 快递信息
const Express = Form.create()(props => {
  const {
    form,
    visible,
    expressClose,
    addExpress,         // 添加快递单
    expressCompany,     // 快递公司
    expressInitialValue,// 默认值
  } = props;
  const count = 0;
  let expressCompanyId = '';
  if(expressInitialValue.express_company){
    expressCompanyId = expressInitialValue.express_company.id
  }
  // 保存
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      addExpress(fieldsValue);
    });
  };
  // 保存并发送
  const okHandlePost = () => {
    if (count === 0) {
      message.error('短信剩余条数不足');
      return;
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      addExpress(fieldsValue);
    });
  };

  const company = [];
  for (let i = 0; i < expressCompany.length; i++) {
    company.push(
      <Option key={expressCompany[i].id} value={expressCompany[i].id}>
        {expressCompany[i].company_name}
      </Option>
    );
  }
  let companyValue = '';
  if (form.getFieldValue('expressCompany'))
    companyValue = form.getFieldValue('expressCompany').label;

  return (
    <Modal
      visible={visible}
      title="快递信息"
      onCancel={expressClose}
      onOk={okHandle}
      footer={
        <div>
          <Button onClick={expressClose}>取消</Button>
        </div>
      }
    >
      <Row gutter={16}>
        <FormItem style={{marginBottom:0}}>
          {form.getFieldDecorator('id', {
            initialValue:expressInitialValue.id,
          })(<span />)}
        </FormItem>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="快递单号：">
            {form.getFieldDecorator('express_id', {
              rules: [{ required: true, message: '请输入快递单号' }],
              initialValue:expressInitialValue.express_id,
            })(<Input placeholder="请输入快递单号" />)}
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="快递公司：">
            {form.getFieldDecorator('expressCompany',{
               initialValue:{key:expressCompanyId},
            })(
              <Select className={styles.selectInline} labelInValue={true}>
                {company}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="快递运费：">
            {form.getFieldDecorator('express_pay', {
              rules: [{ required: true, message: '请输入快递运费' }],
              initialValue:expressInitialValue.express_pay,
            })(<InputNumber maxLength={8} style={{ width: 152 }} step={0.01} min={0} placeholder="0.00" />)}
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="支付账户：">
            {form.getFieldDecorator('pay_method', {
              initialValue:expressInitialValue.pay_method,
            })(
              <Select className={styles.selectInline}>
                <Option value={1}>现金</Option>
                <Option value={2}>银行存款</Option>
                <Option value={3}>POS收银账户</Option>
                <Option value={4}>微信</Option>
                <Option value={5}>支付宝</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="门店号码：">
            {form.getFieldDecorator('store_phone',{
              initialValue:expressInitialValue.store_phone,
            })(<Input placeholder="请输入门店号码" />)}
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="客户手机：">
            {form.getFieldDecorator('customer_phone', {
              rules: [
                { required: true, message: '请设置联系电话' },
                {
                  pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
                  message: '请输入正确的手机号码！',
                },
              ],
              initialValue:expressInitialValue.customer_phone,
            })(<Input maxLength={11} placeholder="请设置门店电话" />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          短信剩余条数 :<span style={{ color: 'red' }}> {count}条</span>
        </Col>
        <Col span={12}>
          <Button type="primary" style={{ float: 'right',marginLeft:'5px' }} onClick={okHandle}>
            保存
          </Button>
          <Button onClick={okHandlePost} style={{ float: 'right' }}>保存并发送</Button>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>功能说明：</Col>
        <Col span={24}>1、保存，仅保存输入的快递信息。</Col>
        <Col span={24}>2、保存并发送，保存输入的快递信息并发送短信通知客户，扣减短信条数。</Col>
      </Row>
      <br />
      <Row>
        <Col span={24}>
          <Card
            title="短信模版："
          >
            <p>
              您的快递已经寄出，发件人：本店，承运人：{companyValue}， 
              货运单号:{form.getFieldValue('express_id')}，
              有问题请致电{form.getFieldValue('store_phone')}。
            </p>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ product, openbill, customer, store, supplier, loading }) => ({
  product,
  openbill,
  customer,
  store,
  supplier,
  loading: loading.models.openbill,
}))
@Form.create()
class SalesUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incomeButtomName: '其他收入',
      payButtomName: '其他支出',
      employeeData: [], // 操作员
      customerVisible: false, // 客户列表Modal
      discount: 100, // 折扣
      payMethodPost: 1, // 支付账户(Int)
      payMethod: '现金', // 支付账户(String)
      // defaultPay: !!Number(localStorage.getItem('defaultPay')), // 是否默认不支付
      goodsCount: 0, // 将要销售的货品数量
      amount: 0, // 将要销售的合计金额
      expressVisible: false, // 快递信息Modal

      expressInfo: {}, // 快递信息默认值
      expressCompany: [], // 快递公司
      otherPayMoney: 0, // 其他支出
      otherIncomeMoney: 0, // 其他收入
      otherPay: {}, // 其他支出
      otherIncome: {}, // 其他收入
      // isArrival: false, // 是否到货
      // isBilling: false, // 是否开票
      // isArrears: !!Number(localStorage.getItem('defaultPay')), // 是否欠款
      // isFreeShipping: false, //  是否包邮
      // isRecovery: false, // 是否回收
      // isExamine: false, // 是否审核
      // isReceivables: false, // 是否收款
      // isSend: false, // 是否发货
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/customerinf', // 客户列表
      payload: {
        page: 1,
      },
    });
    dispatch({
      type: 'store/fetchEmployee', // 员工列表
    });
    dispatch({
      type: 'openbill/fetchExpressCompany', // 快递公司
    });
    dispatch({
      type: 'supplier/supplierinf', // 供应商
      payload: {
        page: 1,
        name: '',
      },
    });
  }

  // props 改变时调用
  componentWillReceiveProps(nextProps) {
    if (nextProps.updateData !== this.props.updateData) {
      const infoData = nextProps.updateData.info;
      const l = infoData.length;
      const tmp = [];
      let amount = 0;
      let goodsCount = 0;
      for (let i = 0; i < l; i++) {
        tmp[i] = infoData[i].goods;
        tmp[i].number = infoData[i].number;
        tmp[i].remarks = infoData[i].remarks;
        tmp[i].price = infoData[i].price;
        tmp[i].stock = tmp[i].number + infoData[i].goods.stock;
        amount += infoData[i].number * infoData[i].price;
        goodsCount += infoData[i].number;
      }
      this.setState({
        orderId: nextProps.updateData.id,
        orderNum: nextProps.updateData.order_id,
        operatorId: nextProps.updateData.operator_id,
        orderTime: nextProps.updateData.order_date,
        customerName: nextProps.updateData.customer.name, // 客户名称
        customerType: nextProps.updateData.customer.customer_type, // 客户类型
        customerId: nextProps.updateData.customer_id,
        receivables: nextProps.updateData.total_price_final,
        discount:(nextProps.updateData.total_price_final/amount).toFixed(2)*100,
        // num.toFixed(2)
        pay: nextProps.updateData.pay, // 支付
        saleOrderProducts: tmp, // 将要销售的货品
        goodsCount, // 将要销售的货品数量
        amount, // 将要销售的合计金额
        expressOrederNum: nextProps.updateData.express.express_id
          ? nextProps.updateData.express.express_id
          : '未填写',
        expressPay: nextProps.updateData.express_pay,
        expressInfo: nextProps.updateData.express, // 快递信息默认值
        otherPayMoney: nextProps.updateData.other_pay_price, // 其他支出
        otherIncomeMoney: nextProps.updateData.other_income_price, // 其他收入
        otherPay: nextProps.updateData.sales_other_pay, // 其他支出
        otherIncome: nextProps.updateData.sales_other_income, // 其他收入
        remarks: nextProps.updateData.remarks,
        isArrival: nextProps.updateData.is_arrival, // 是否到货
        isBilling: nextProps.updateData.is_billing, // 是否开票
        isArrears: nextProps.updateData.is_arrears, // 是否欠款
        isFreeShipping: nextProps.updateData.is_free_shipping, //  是否包邮
        isRecovery: nextProps.updateData.is_recovery, // 是否回收
        isExamine: nextProps.updateData.is_examine, // 是否审核
        isReceivables: nextProps.updateData.is_receivables, // 是否收款
        isSend: nextProps.updateData.is_send, // 是否发货
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

      // console.log(nextProps.updateData);
    }

    if (nextProps.openbill !== this.props.openbill) {
      this.setState({
        expressCompany: nextProps.openbill.expressCompany,
      });
    }

    if (nextProps.store !== this.props.store) {
      this.setState({
        employeeData: nextProps.store.employeeData,
      });
    }

    if (nextProps.customer !== this.props.customer) {
      this.setState({
        customerData: nextProps.customer.customerData,
        customerTotal: nextProps.customer.customerTotal,
      });
    }

    if (nextProps.supplier !== this.props.supplier) {
      this.setState({
        supplierData: nextProps.supplier.supplierData,
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
    if (!dateString) {
      return;
    }

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

  /**
   * 显示添加客户
   */

  addCustomer = () => {
    this.setState({
      addCustomerVisible: true,
    });
  };

  /**
   * 关闭添加客户
   */
  addCustomerClose = () => {
    this.setState({
      addCustomerVisible: false,
    });
  };

  /**
   * 添加客户(添加完成后)
   */
  customerAdd = data => {
    const tmp = this.props.customer.customerData;

    tmp.unshift(data);

    this.setState({
      addCustomerVisible: false,
    });
  };

  /**
   * 搜索客户
   */
  customerSearch = value => {
    const customerDataProps = this.props.customer.customerData;

    const reg = new RegExp(value, 'gi');

    const searchData = customerDataProps
      .map(record => {
        const match = record.name.match(reg);

        if (!match) {
          return null;
        }
        return { ...record };
      })
      .filter(record => !!record);

    this.setState({
      customerData: searchData,
    });
  };

  /**
   * 搜索关键字为空时
   */

  customerChange = e => {
    if (e.target.value === '') {
      this.setState({
        customerData: this.props.customer.customerData,
      });
    }
  };

  /**
   * 点击行选择客户
   */

  selectCust = value => {
    this.setState(
      {
        customerName: value.name,

        customerId: value.id, // 客户ID

        customerPay: value.pay,

        customerType: value.customer_type,

        customerVisible: false,
      },
      () => {
        const { saleOrderProducts } = this.state;
        for (let i = 0; i < saleOrderProducts.length; i++) {
          if (this.state.customerType === '零售') saleOrderProducts[i].price = saleOrderProducts[i].retail_price;
          else saleOrderProducts[i].price = saleOrderProducts[i].wholesale_price;
        }

        this.setState({
          saleOrderProducts,
        });

        this.addupAmount(this.state.saleOrderProducts);
      }
    );
  };

  /**
   * 折后应收
   */

  receChange = e => {
    // const { defaultPay } = this.state;

    if (isNaN(e)) {
      e = 0;
    }

    const tabledata = this.state.saleOrderProducts;
    let count = 0;
    for (let i = 0; i < tabledata.length; i++) {
      count += tabledata[i].number * tabledata[i].price;
    }
    if (count === 0) return;
    const dis = (e / count).toFixed(2) * 100;

    // if (defaultPay) {
    //   this.setState({
    //     receivables: e, // 折后应收
    //     pay: 0,
    //     discount: dis,
    //     // collect:0,
    //   });
    // } else {
      this.setState({
        receivables: e, // 折后应收
        pay: e,
        discount: dis,
        // collect:e,
      });
    // }
  };

  /**
   * 折扣
   */

  disChange = e => {
    // const { defaultPay } = this.state;

    if (isNaN(e)) {
      e = 0;
    }

    const tabledata = this.state.saleOrderProducts;

    let count = 0;

    for (let i = 0; i < tabledata.length; i++) {
      count += tabledata[i].number * tabledata[i].price;
    }
    if (count === 0) return;

    const rece = count * e * 0.01;

    // if (defaultPay) {
    //   this.setState({
    //     discount: e, // 折扣率
    //     receivables: rece,
    //     pay: 0,
    //     // collect:0,
    //   });
    // } else {
      this.setState({
        discount: e, // 折扣率
        receivables: rece,
        pay: rece,
        // collect:rece,
      });
    // }
  };

  /**
   * 支付方式
   */
  payMet = value => {
    this.setState({
      payMethod: value.label,
      payMethodPost: value.key,
    });
  };

  /**
   * 支付
   */
  payChange = e => {
    // const { defaultPay } = this.state;

    // if (isNaN(e) || defaultPay) {
    //   e = 0;
    // }
    if (isNaN(e)) {
      e = 0;
    }

    this.setState({
      pay: e,
      // collect:e,
    });
  };

  // /**
  //  * 默认不支付
  //  */
  // defaultPay = () => {
  //   const { defaultPay, receivables } = this.state;

  //   this.setState(
  //     {
  //       defaultPay: !defaultPay,
  //       isArrears: !defaultPay,
  //     },
  //     () => {
  //       if (defaultPay) {
  //         localStorage.setItem('defaultPay', 0);
  //         this.setState({
  //           pay: receivables,
  //         });
  //       } else {
  //         localStorage.setItem('defaultPay', 1);
  //         this.setState({
  //           pay: 0,
  //         });
  //       }
  //     }
  //   );
  // };

  /**
   * 显示添加货品
   */
  addGoods = () => {
    this.setState({
      addGoodsVisible: true,
    });
  };

  /**
   * 确定添加的货品
   */
  addSelectGoods = goods => {
    const { saleOrderProducts } = this.state;
    for (let i = 0; i < goods.length; i++) {
      window.isExist = false;

      for (let j = 0; j < saleOrderProducts.length; j++) {
        if (saleOrderProducts[j].id === goods[i].id) {
          if (saleOrderProducts[j].number >= saleOrderProducts[j].stock) {
            message.error('选择的货品超出库存！');
            return;
          }
          window.isExist = true;

          saleOrderProducts[j].number++;
          break;
        }
      }
      if (!window.isExist) {
        if (this.state.customerType === '零售') goods[i].price = goods[i].retail_price;
        else goods[i].price = goods[i].wholesale_price;
        goods[i].number = 1;
        saleOrderProducts.push(goods[i]);
      }
    }
    this.addupAmount(saleOrderProducts);

    this.setState({
      saleOrderProducts, //  Table用
      addGoodsVisible: false,
    });
  };

  /**
   * 关闭添加货品
   */
  addGoodsClose = () => {
    this.setState({
      addGoodsVisible: false,
    });
  };

 /**
   * 计算合计金额
   */
  addupAmount = tableData => {
    const { otherPayMoney, otherIncomeMoney } = this.state;
    let count = 0;
    let goodsCount = 0;

    for (let i = 0; i < tableData.length; i++) {
      count += tableData[i].number * tableData[i].price;
      goodsCount += tableData[i].number;
    }

    this.setState({
      amount: count,
      receivables: count,
      discount: 100,
      goodsCount,
    });

    // if (this.state.defaultPay) {
    //   this.setState({
    //     pay: 0,
    //   });
    // } else {
      this.setState({
        pay: count - otherPayMoney + otherIncomeMoney,
      });
    // }
  };

  /**
   * 修改单价
   */

  changePrice = (record, e) => {
    console.log(e);
    const { saleOrderProducts } = this.state;
    for (let i = 0; i < saleOrderProducts.length; i++) {
      if (record.id === saleOrderProducts[i].id) {
        if (isNaN(e)) {
          saleOrderProducts[i].price = 0;
          break;
        }

        saleOrderProducts[i].price = e;
        console.log(saleOrderProducts[i]);
      }
    }

    this.addupAmount(saleOrderProducts);
    this.setState({
      saleOrderProducts,
    });
  };

  /**
   * 修改数量
   */

  changeNumber = (record, e) => {
    const { saleOrderProducts } = this.state;

    for (let i = 0; i < saleOrderProducts.length; i++) {
      if (record.id === saleOrderProducts[i].id) {
        if (isNaN(e)) {
          saleOrderProducts[i].number = 0;
          break;
        }

        saleOrderProducts[i].number = e;
      }
    }

    this.addupAmount(saleOrderProducts);
    this.setState({
      saleOrderProducts,
    });
  };

  /**
   * 修改货品备注
   */
  goodsRemarks = (record, e) => {
    const { saleOrderProducts } = this.state;


    for (let i = 0; i < saleOrderProducts.length; i++) {
      if (record.id === saleOrderProducts[i].id) {
        saleOrderProducts[i].remarks = e.target.value;
      }
    }

    this.addupAmount(saleOrderProducts);
    this.setState({
      saleOrderProducts,
    });
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

  /**
   *  处理最后要上传的数据
   */
  handleGoods = data => {
    const tmp = data;
    for (let i = 0; i < tmp.length; i++) {
      tmp[i].final_price = tmp[i].number * tmp[i].price;
      tmp[i].goods_id = tmp[i].id;
      tmp[i].order_id = this.state.orderNum;
      delete tmp[i].id;
      delete tmp[i].code;
      delete tmp[i].name;
      delete tmp[i].category;
      delete tmp[i].category_id;
      delete tmp[i].unit;
      delete tmp[i].bar_code;
      delete tmp[i].created_at;
      delete tmp[i].img_path;
      delete tmp[i].inventory_cost;
      delete tmp[i].max_stock;
      delete tmp[i].min_stock;
      delete tmp[i].purchase_cost;
      delete tmp[i].spec;
      delete tmp[i].state;
      delete tmp[i].stock;
      delete tmp[i].store_id;
      delete tmp[i].supplier;
      delete tmp[i].supplier_id;
      delete tmp[i].unit_cost;
      delete tmp[i].updated_at;
      delete tmp[i].unit_id;
      delete tmp[i].wholesale_price;
      delete tmp[i].retail_price;
    }
    return tmp;
  };

  /**
   *  修改销售单
   */
  saleGoods = () => {
    const { dispatch } = this.props;

    const {
      orderId,
      orderTime,
      orderNum,
      operatorId,
      receivables,
      amount,
      pay,
      remarks,
      lableState,
      payMethodPost,
      saleOrderProducts,
      customerId,
      customerName,
      expressInfo,
      otherPay,
      otherIncome,
      expressPay,
      otherIncomeMoney,
      otherPayMoney,
      isArrival, // 是否到货
      isBilling, // 是否开票
      isArrears, // 是否欠款
      isFreeShipping, //  是否包邮
      isRecovery, // 是否回收
      isExamine, // 是否审核
      isReceivables, // 是否收款
      isSend, //  是否发货
    } = this.state;

    if (saleOrderProducts.length === 0) {
      return;
    }
    const tmp = [];
    for (let i = 0; i < saleOrderProducts.length; i++) {
      tmp[i] = Object.assign({}, saleOrderProducts[i]);
    }

    let cost = 0;
    for (let i = 0; i < saleOrderProducts.length; i++) {
      cost += saleOrderProducts[i].number * saleOrderProducts[i].unit_cost;
    }

    const data = this.handleGoods(tmp);

    const payload = {
      id: orderId,
      order_id: orderNum, // 订单号
      operator_id: operatorId, // 操作员
      total_price_final: receivables, // 折后应收
      total_price: amount, // 合计金额（原价）
      pay, // 支付
      remarks, // 备注
      state: lableState,
      pay_method: payMethodPost, // 支付方式
      info: data, // 销售货品
      order_date: orderTime, // 订单日期
      profit: pay - cost, // 利润
      cost, // 总成本
      customer_id: customerId, // 客户ID
      customer_name: customerName, // 客户名称
      other_income_price: otherIncomeMoney, // 其他收入
      other_pay_price: otherPayMoney, // 其他支出
      express_pay: expressPay, // 快递运费
      express: expressInfo, // 快递信息
      other_pay: otherPay, // 其他支出 详情
      other_income: otherIncome, // 其他收入 详情
      is_arrival: Number(isArrival), // 是否到货
      is_billing: Number(isBilling), // 是否开票
      is_arrears: Number(isArrears), // 是否欠款
      is_free_shipping: Number(isFreeShipping), //  是否包邮
      is_recovery: Number(isRecovery), // 是否回收
      is_examine: Number(isExamine), // 是否审核
      is_receivables: Number(isReceivables), // 是否收款
      is_send: Number(isSend), //  是否发货
    };
    console.log(payload);
    dispatch({
      type: 'openbill/updateSales',
      payload,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.props.callback();
          this.otherIncome.resetForm();
          this.otherPay.resetForm();
        }
      },
    });
  };

  /**
   * 搜索并添加
   */
  addSaleProduct = value => {
    if (value === '') return;
    const { dispatch } = this.props;
    const searchData = [];
    dispatch({
      type: 'openbill/searchGoods', //
      payload: {
        bar_code: value,
      },
      callback: res => {
        if (!res.data) {
          message.error('货品不存在');
          return;
        }
        searchData.push(res.data);
        if (searchData[0].stock === 0) {
          message.error('货品库存不足');
          return;
        }
        const { saleOrderProducts } = this.state;
        for (let i = 0; i < searchData.length; i++) {
          window.isExist = false;
          for (let j = 0; j < saleOrderProducts.length; j++) {
            if (saleOrderProducts[j].id === searchData[i].id) {
              if (saleOrderProducts[j].number >= saleOrderProducts[j].stock) {
                message.error('货品库存不足');
                return;
              }
              window.isExist = true;
              saleOrderProducts[j].number++;
              break;
            }
          }
          if (!window.isExist) {
            if (this.state.customerType === '零售')
              searchData[i].price = searchData[i].retail_price;
            else searchData[i].price = searchData[i].wholesale_price;
            searchData[i].number = 1;
            saleOrderProducts.push(searchData[i]);
          }
        }
        this.addupAmount(saleOrderProducts);
        this.setState({
          saleOrderProducts,
        });
      },
    });
  };

  /**
   * 删除操作
   */
  delGoods = record => {
    const { saleOrderProducts } = this.state;
    for (let i = 0; i < saleOrderProducts.length; i++) {
      if (record.id === saleOrderProducts[i].id) {
        saleOrderProducts.splice(i, 1);
      }
    }
    this.addupAmount(saleOrderProducts);
    this.setState({
      saleOrderProducts,
    });
  };

  /**
   * 快递信息
   */
  expressShow = () => {
    this.setState({
      expressVisible: true,
    });
  }

  /**
   * 关闭快递信息
   */
  expressClose = () => {
    this.setState({
      expressVisible: false,
    });
  }

  /**
   * 快递信息详情
   */
  addExpress = fieldsValue => {
    if (fieldsValue.expressCompany) fieldsValue.company_id = fieldsValue.expressCompany.key;
    delete fieldsValue.expressCompany;
    this.setState({
      expressVisible: false,
      expressInfo: fieldsValue,
      expressOrederNum: fieldsValue.express_id,
      expressPay: fieldsValue.express_pay,
    });
  }

  /**
   * 是否到货
   */
  changeArrival = e => {
    this.setState({
      isArrival: e,
    });
  }

  /**
   * 是否开票
   */
  changeBilling = e => {
    this.setState({
      isBilling: e,
    });
  };

  /**
   * 是否欠款
   */
  changeArrears = e => {
    this.setState({
      isArrears: e,
    });
  };

  /**
   * 是否包邮
   */
  changeFreeShipping = e => {
    this.setState({
      isFreeShipping: e,
    });
  }

  /**
   * 是否回收
   */
  changeRecovery = e => {
    this.setState({
      isRecovery: e,
    });
  }

  /**
   * 是否审核
   */
  changeExamine = e => {
    this.setState({
      isExamine: e,
    });
  }

  /**
   * 是否收款
   */
  changeReceivables = e => {
    this.setState({
      isReceivables: e,
    });
  }

  /**
   * 是否发货
   */
  changeSend = e => {
    this.setState({
      isSend: e,
    });
  }

  /**
   * 保存其他收入
   */
  saveOtherIncome = (fields, sum) => {
    const { receivables, otherPayMoney } = this.state;
    this.setState({
      otherIncomeMoney: sum,
      otherIncome: fields,
      pay: receivables + sum - otherPayMoney,
    });
  }

  /**
   * 保存其他支出
   */
  saveOtherPay = (fields, sum) => {
    const { receivables, otherIncomeMoney } = this.state;
    this.setState({
      otherPayMoney: sum,
      otherPay: fields,
      pay: receivables + otherIncomeMoney - sum,
    });
  }

  render() {
    const {
      addCustomerVisible,
      customerData,
      goodsCount,
      orderNum,
      employeeData,
      supplierData,
      otherIncome,
      otherPay,
    } = this.state;
    // 其他收入
    const inComedata = [
      {
        formName: 'id',
        tab: <span />,
        initialValue: otherIncome.id,
      },
      {
        label: '货运费',
        formName: 'freight_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherIncome.freight_cost,
      },
      {
        label: '材料费',
        formName: 'materials_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherIncome.materials_cost,
      },
      {
        label: '包装费',
        formName: 'packing_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherIncome.packing_cost,
      },
      {
        label: '安装费',
        formName: 'installation_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherIncome.installation_cost,
      },
      {
        label: '回收费',
        formName: 'recovery_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherIncome.recovery_cost,
      },
      {
        label: '其他费',
        formName: 'other_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherIncome.other_cost,
      },
      {
        label: '备注',
        formName: 'remarks',
        tab: <TextArea placeholder="请输入备注" />,
        span: 24,
        labelCol: 4,
        initialValue: otherIncome.remarks,
      },
    ];
    // 其他支出
    const paydata = [
      {
        formName: 'id',
        tab: <span />,
        initialValue: otherPay.id,
      },
      {
        label: '货运费',
        formName: 'freight_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherPay.freight_cost,
      },
      {
        label: '材料费',
        formName: 'materials_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherPay.materials_cost,
      },
      {
        label: '包装费',
        formName: 'packing_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherPay.packing_cost,
      },
      {
        label: '安装费',
        formName: 'installation_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherPay.installation_cost,
      },
      {
        label: '其他费',
        formName: 'other_cost',
        rules,
        tab: <Input placeholder="0" />,
        span: 12,
        labelCol: 8,
        initialValue: otherPay.other_cost,
      },
      {
        label: '备注',
        formName: 'remarks',
        tab: <TextArea placeholder="请输入备注" />,
        span: 24,
        labelCol: 4,
        initialValue: otherPay.remarks,
      },
    ];
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
      return <span style={{ color: 'red' }}> 欠款:{this.state.customerPay}元</span>;
    };

    // 选择客户 props
    const customerMethods = {
      customerAdd: this.customerAdd,
      closeCustomer: this.closeCustomer,
      customerSearch: this.customerSearch,
      customerChange: this.customerChange,
      selectCust: this.selectCust,
      addCustomer: this.addCustomer,
      addCustomerClose: this.addCustomerClose,
      customerData,
      addCustomerVisible,
      customerTotal: this.state.customerTotal,
    };

    //  添加货品  props
    const addGoodsMethods = {
      addGoodsClose: this.addGoodsClose,
      addSelectGoods: this.addSelectGoods,
      supplierData,
    };

    // 其他收入props
    const incomeMethods = {
      buttonName: this.state.incomeButtomName,
      sum: this.state.otherIncomeMoney, // 总和
      onRef: ref => {
        this.otherIncome = ref;
      }, // 让父组件可以调用子组件方法
      dataInfo: this.saveOtherIncome,
      dataSource: inComedata,
    };

    // 其他支出props
    const payMethodPosts = {
      buttonName: this.state.payButtomName,
      sum: this.state.otherPayMoney, // 总和
      onRef: ref => {
        this.otherPay = ref;
      }, // 让父组件可以调用子组件方法
      dataSource: paydata,
      dataInfo: this.saveOtherPay,
    };

    // 快递信息props
    const expressMethods = {
      expressClose: this.expressClose,
      expressCompany: this.state.expressCompany,
      addExpress: this.addExpress,
      expressInitialValue: this.state.expressInfo,
    };

    // 销售货品表头
    const saleColumns = [
      {
        title: '货品图片',
        dataIndex: 'img_path',
        key: 'img_path',
        render: (text, record) => {
          return (
            <div style={{ width: '64px' }} dangerouslySetInnerHTML={{ __html: record.img_path }} />
          );
        },
      },
      {
        title: '货品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '单位',
        dataIndex: 'unit.name',
        key: 'unit.name',
      },
      {
        title: '数量',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => (
          <InputNumber
            min={0}
            max={record.stock}
            value={record.number}
            style={{ width: 100 }}
            onChange={e => this.changeNumber(record, e)}
          />
        ),
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => {
          return (
            <InputNumber
              step={0.01}
              value={record.price}
              style={{ width: 100 }}
              onChange={e => this.changePrice(record, e)}
            />
          );
        },
      },
      {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
        render: (money, record) => (
          <Input value={record.number * record.price} disabled={true} style={{ width: 100 }} />
        ),
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (remarks, record) => (
          <Input placeholder={remarks} onChange={e => this.goodsRemarks(record, e)} />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <Popconfirm title="是否要删除此货品？" onConfirm={() => this.delGoods(record)}>
            <Icon 
              type="close-circle" 
              theme="outlined" 
              style={{fontSize:'16px',color:'red',cursor:'pointer'}} 
            />
          </Popconfirm>
        ),
      },
    ];

    return (
      <div>
        <Modal
          title="编辑销售单"
          visible={this.props.visible}
          destroyOnClose={true}
          // onOk={this.props.handleOk}
          onCancel={this.props.handleCancel}
          width={1200}
          footer={null}
        >
          <Row gutter={8}>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
              <span>单　　号: </span>
              <span className={styles.orderNum}>{orderNum}</span>
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
                allowClear={false}
                style={{ width: 130 }}
                defaultValue={moment(this.state.orderTime)}
                onChange={this.orderTime}
                disabledDate={this.disabledDate}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={5} xxl={4} style={{ marginTop: 5 }}>
              <span>客　　户: </span>
              <Tooltip placement="topLeft" title={this.state.customerName} arrowPointAtCenter>
                <Button onClick={this.showCustomer} className={commonStyle.customerButton} style={{width:130}}>
                  {this.state.customerName}
                </Button>
              </Tooltip>        
              <Pay />
            </Col>
            {/* <Col xs={24} sm={24} md={24} lg={24} xl={{ span: 3, push: 1 }} style={{ marginTop: 5 }}>
              <Link to="/salesDetails/salesSlip">
                <Button type="primary">销售详情</Button>
              </Link>
            </Col> */}
          </Row>
          <Divider />
          <CustomerModal {...customerMethods} customerVisible={this.state.customerVisible} />
          <Row gutter={4} style={{ marginBottom: 10 }}>
            <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
              <span>折后应收: </span>
              <InputNumber value={this.state.receivables} step={0.01} onChange={this.receChange} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
              <span>折&nbsp;&nbsp;扣&nbsp;&nbsp;率: </span>
              <InputNumber
                value={this.state.discount}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                onChange={this.disChange}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
              <span>收款账户: </span>
              <Select
                labelInValue
                value={{ key: this.state.payMethodPost }}
                style={{ width: 90 }}
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
            <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
              <span>{this.state.payMethod}支付: </span>
              <Tooltip title={`${this.state.pay}元`}>
                <InputNumber value={this.state.pay} min={0} onChange={this.payChange} step={0.01} />
              </Tooltip>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
              <span>实收: </span>
              <span className={styles.orderNum}>{this.state.pay}元</span>
            </Col>
            {/* <Col xs={24} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
              <Checkbox
                className={styles.orderNum}
                onChange={this.defaultPay}
                checked={this.state.defaultPay}
              >
                默认不支付
              </Checkbox>
            </Col> */}
          </Row>
          <Table
            className={commonStyle.tableAdaption}
            columns={saleColumns}
            dataSource={this.state.saleOrderProducts}
            rowKey={record => record.id}
            locale={{ emptyText: '' }}
          />
          <Row gutter={8} style={{ paddingTop: 10 }}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <span className={styles.title}>条码专用: </span>
              <Search
                placeholder="请输入条码或使用扫码枪"
                onSearch={this.addSaleProduct}
                style={{ width: 200 }}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={this.saleGoods} style={{ marginRight: 4 }}>
                  保存
                </Button>
                <Button type="primary" onClick={this.addGoods}>
                  添加货品
                </Button>
                <AddGoods {...addGoodsMethods} visible={this.state.addGoodsVisible} />
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div style={{ float: 'right', marginRight: 12 }}>
                <span className={styles.title} style={{ marginRight: 8 }}>
                  选择货品: {goodsCount}
                </span>
                <span className={styles.title}>合计金额: {this.state.amount}</span>
              </div>
            </Col>
          </Row>
          <Divider />
          <Row gutter={8}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <TextArea
                placeholder="备注(最多140字)"
                maxLength={140}
                onChange={this.fetchRemarks}
                autosize={{ minRows: 4, maxRows: 4 }}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div style={{ textAlign: 'center' }}>
                <OtherIncomeAndPay {...incomeMethods} />
                <OtherIncomeAndPay {...payMethodPosts} />
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div>
                <Row>
                  <Col span={6} style={{ marginTop: 5 }}>
                    <CheckableTag checked={this.state.isArrival} onChange={this.changeArrival}>
                      已到货
                    </CheckableTag>
                  </Col>
                  <Col span={6} style={{ marginTop: 5 }}>
                    <CheckableTag checked={this.state.isBilling} onChange={this.changeBilling}>
                      已开票
                    </CheckableTag>
                  </Col>
                  <Col span={6} style={{ marginTop: 5 }}>
                    <CheckableTag checked={this.state.isArrears} onChange={this.changeArrears}>
                      有欠款
                    </CheckableTag>
                  </Col>
                  <Col span={6} style={{ marginTop: 5 }}>
                    <CheckableTag
                      checked={this.state.isFreeShipping}
                      onChange={this.changeFreeShipping}
                    >
                      已包邮
                    </CheckableTag>
                  </Col>
                  <Col span={6} style={{ marginTop: 5 }}>
                    <CheckableTag checked={this.state.isRecovery} onChange={this.changeRecovery}>
                      已回收
                    </CheckableTag>
                  </Col>
                  <Col span={6} style={{ marginTop: 5 }}>
                    <CheckableTag checked={this.state.isExamine} onChange={this.changeExamine}>
                      已审核
                    </CheckableTag>
                  </Col>
                  <Col span={6} style={{ marginTop: 5 }}>
                    <CheckableTag
                      checked={this.state.isReceivables}
                      onChange={this.changeReceivables}
                    >
                      已收款
                    </CheckableTag>
                  </Col>
                  <Col span={6} style={{ marginTop: 5 }}>
                    <CheckableTag checked={this.state.isSend} onChange={this.changeSend}>
                      已发货
                    </CheckableTag>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs={24} sm={12} md={12} lg={5} xl={6}>
              <Input addonBefore="快递单号:" value={this.state.expressOrederNum} disabled={true} />
            </Col>
            {/* 快递单组件 */ }
            <Express visible={this.state.expressVisible} {...expressMethods} />
            <Col xs={24} sm={12} md={12} lg={5} xl={3}>
              <Button type="dashed" onClick={this.expressShow} style={{ color: '#0f91e7' }}>
                填写快递单
              </Button>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <span className={styles.orderNum}>运费金额：{this.state.expressPay}元</span>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
export default SalesUpdate