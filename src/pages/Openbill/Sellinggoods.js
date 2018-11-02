import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {
  Tag,
  Row,
  Col,
  Select,
  Form,
  DatePicker,
  Button,
  Input,
  Table,
  InputNumber,
  Checkbox,
  Divider,
  message,
  Tooltip,
  Modal,
  Card,
  Icon,
  Popconfirm,
} from 'antd';

import OtherIncomeAndPay from '@/components/OtherIncomeAndPay';
import AddGoods from '@/components/ProductSelect';
import CustomerModal from '@/components/CustomerSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from  './index.less';
import commonStyle from '../../global.less'; // 公共样式

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;
const { CheckableTag } = Tag;
const FormItem = Form.Item;

// 本地存储 是否默认不支付
if (localStorage.getItem('defaultPay') === null) {
  // 0 不打勾
  localStorage.setItem('defaultPay', 0);
}

const rules = [{ pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '请输入正确金额' }];
// 其他收入
const inComedata = [
  {
    label: '货运费',
    formName: 'freight_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '材料费',
    formName: 'materials_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '包装费',
    formName: 'packing_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '安装费',
    formName: 'installation_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '回收费',
    formName: 'recovery_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '其他费',
    formName: 'other_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '备注',
    formName: 'remarks',
    tab: <TextArea placeholder="请输入备注" />,
    span: 24,
    labelCol: 4,
  },
];
// 其他支出
const paydata = [
  {
    label: '货运费',
    formName: 'freight_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '材料费',
    formName: 'materials_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '包装费',
    formName: 'packing_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '安装费',
    formName: 'installation_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '其他费',
    formName: 'other_cost',
    rules,
    tab: <Input placeholder="0" />,
    span: 12,
    labelCol: 8,
  },
  {
    label: '备注',
    formName: 'remarks',
    tab: <TextArea placeholder="请输入备注" />,
    span: 24,
    labelCol: 4,
  },
];

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
               initialValue:expressInitialValue.expressCompany,
            })(
              <Select className={styles.selectInline} style={{ width: '100%' }} labelInValue={true}>
                {company}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="快递运费：">
            {form.getFieldDecorator('express_pay', {
              rules: [{ required: true, message: '请输入快递运费' }],
            })(<InputNumber maxLength={8} style={{ width: 152 }} step={0.01} min={0} placeholder="0.00" />)}
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="支付账户：">
            {form.getFieldDecorator('pay_method', {
              initialValue: 1,
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
            {form.getFieldDecorator('store_phone')(<Input placeholder="请输入门店号码" />)}
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


@connect(({ openbill, store, supplier, loading }) => ({
  openbill,
  store,
  supplier,
  loading: loading.models.openbill,
}))
@Form.create()
class Sellinggoods extends Component {
  constructor(props) {
    super(props);
    let tmpSale = [];
    if (props.location.state) {
      const tmp = props.location.state.data;
      tmp.price = tmp.retail_price;
      tmp.number = 1;
      tmpSale = [tmp];
    }

    this.state = {
      incomeButtomName: '其他收入',
      payButtomName: '其他支出',
      orderNum: '', // 订单号
      employeeData: [], // 操作员
      customerName: '零售客户', // 客户名称
      customerType: '零售', // 客户类型
      customerId: 1, // 客户Id
      customerVisible: false, // 客户列表Modal
      receivables: 0, // 折后应收
      discount: 100, // 折扣
      payMethodPost: 1, // 支付账户(Int)
      pay: 0, // 支付
      defaultPay: !!Number(localStorage.getItem('defaultPay')), // 是否默认不支付

      saleOrderProducts: tmpSale, // 将要销售的货品

      goodsCount: 0, // 将要销售的货品数量
      amount: 0, // 将要销售的合计金额

      expressVisible: false, // 快递信息Modal
      expressOrederNum: '未填写', // 快递单号
      expressPay: 0, // 快递运费
      expressInfo: {}, // 快递信息默认值

      expressCompany: [], // 快递公司
      otherPayMoney: 0, // 其他支出
      otherIncomeMoney: 0, // 其他收入
      otherPay: {}, // 其他支出
      otherIncome: {}, // 其他收入
      isArrival: false, // 是否到货
      isBilling: false, // 是否开票
      isArrears: !!Number(localStorage.getItem('defaultPay')), // 是否欠款
      isFreeShipping: false, //  是否包邮
      isRecovery: false, // 是否回收
      isExamine: false, // 是否审核
      isReceivables: false, // 是否收款
      isSend: false, // 是否发货
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchOrderNum', // 订单号
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
      },
    });
  }

  // props 改变时调用
  componentWillReceiveProps(nextProps) {
    if (nextProps.openbill !== this.props.openbill) {
      this.setState({
        orderNum: nextProps.openbill.orderNum,
        expressCompany: nextProps.openbill.expressCompany,
      });
    }

    if (nextProps.store !== this.props.store) {
      this.setState({
        employeeData: nextProps.store.employeeData,
      });
    }

    if (nextProps.supplier !== this.props.supplier) {
      this.setState({
        supplierData: nextProps.supplier.supplierData,
      });
    }
  }


  /**
   * 不能选择的日期
   */
  disabledDate = current => {
    return current > moment().endOf('day');
  };

  selectOperator = (e) =>{
    this.setState({
      operatorId:e,
    })
  }

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
        const tabledata = saleOrderProducts;

        for (let i = 0; i < tabledata.length; i++) {
          if (this.state.customerType === '零售') tabledata[i].price = tabledata[i].retail_price;
          else tabledata[i].price = tabledata[i].wholesale_price;
        }

        this.setState({
          saleOrderProducts: tabledata,
        });

        this.addupAmount(this.state.saleOrderProducts);
      }
    );
  };

  /**
   * 折后应收
   */
  receChange = e => {
    
    const { defaultPay, otherPayMoney, otherIncomeMoney } = this.state;

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

    if (defaultPay) {
      this.setState({
        pay: 0,
        receivables:e,
        discount:dis,
      });
    } else {
      this.setState({
        receivables:e,
        discount:dis,
        pay: e + otherIncomeMoney - otherPayMoney,
      });
    }
  };

  /**
   * 折扣
   */
  disChange = e => {
    const { defaultPay, otherPayMoney, otherIncomeMoney } = this.state;

    if (isNaN(e)) {
      this.props.form.setFieldsValue({
        discount:100,
      })
      return;
    }

    const tabledata = this.state.saleOrderProducts;

    let count = 0;

    for (let i = 0; i < tabledata.length; i++) {
      count += tabledata[i].number * tabledata[i].price;
    }


    const rece = count * e * 0.01;

    this.props.form.setFieldsValue({
      receivables: rece,
      discount:e,
      pay: rece + otherIncomeMoney - otherPayMoney,
    })

    if (defaultPay) {
      this.setState({
        pay: 0,
      });
    } else {
      this.setState({
        pay: rece + otherIncomeMoney - otherPayMoney,
      });
    }
  };

  /**
   * 支付方式
   */
  payMet = value => {
    this.setState({
      payMethodPost: value.key,
    });
  };

  /**
   * 支付
   */
  payChange = e => {
    const { defaultPay } = this.state;
    if(e===''){
      e=0;
    }
   
    if (isNaN(e) || defaultPay) {
      e = 0;
    }

    this.setState({
      pay: e,
    });
    this.props.form.setFieldsValue({
      pay: e,
    })

  };

  /**
   * 默认不支付
   */
  defaultPay = () => {
    const { defaultPay, receivables, otherPayMoney, otherIncomeMoney } = this.state;

    this.setState(
      {
        defaultPay: !defaultPay,
        isArrears: !defaultPay,
      },
      () => {
        if (defaultPay) {
          localStorage.setItem('defaultPay', 0);
          this.setState({
            pay: receivables - otherPayMoney + otherIncomeMoney,
          });
        } else {
          localStorage.setItem('defaultPay', 1);
          this.setState({
            pay: 0,
          });
        }
      }
    );
  };

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
    const tabledata = saleOrderProducts;

    for (let i = 0; i < goods.length; i++) {
      window.isExist = false;

      for (let j = 0; j < tabledata.length; j++) {
        if (tabledata[j].id === goods[i].id) {
          if (tabledata[j].number >= tabledata[j].stock) {
            message.error('选择的货品超出库存！');
            return;
          }
          window.isExist = true;

          tabledata[j].number++;
          break;
        }
      }
      if (!window.isExist) {
        if (this.state.customerType === '零售') goods[i].price = goods[i].retail_price;
        else goods[i].price = goods[i].wholesale_price;
        goods[i].number = 1;
        tabledata.push(goods[i]);
      }
    }
    this.addupAmount(tabledata);

    this.setState({
      saleOrderProducts: tabledata, //  Table用
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
      // receivables: count,
      // discount: 100,
      goodsCount,
    });

    if (this.state.defaultPay) {
      this.setState({
        pay: 0,
        receivables: count,
        discount:100,
      });
    } else {
      this.setState({
        receivables: count,
        discount:100,
        pay: count - otherPayMoney + otherIncomeMoney,
      });
    }

    this.props.form.setFieldsValue({
      receivables: count,
      discount:100,
      pay:count - otherPayMoney + otherIncomeMoney,
    })

  };

  /**
   * 修改单价
   */
  changePrice = (record, e) => {
    const { saleOrderProducts } = this.state;
    const data = saleOrderProducts;
    for (let i = 0; i < data.length; i++) {
      if (record.id === data[i].id) {
        if (isNaN(e)) {
          data[i].price = 0;
          break;
        }
        data[i].price = e;
      }
    }

    this.addupAmount(data);
    this.setState({
      saleOrderProducts: data,
    });
  };

  /**
   * 修改数量
   */
  changeNumber = (record, e) => {
    const { saleOrderProducts } = this.state;
    const data = saleOrderProducts;

    for (let i = 0; i < data.length; i++) {
      if (record.id === data[i].id) {
        if (isNaN(e)) {
          data[i].number = 0;
          break;
        }

        data[i].number = e;
      }
    }

    this.addupAmount(data);
    this.setState({
      saleOrderProducts: data,
    });
  };

  /**
   * 修改货品备注
   */
  goodsRemarks = (record, e) => {
    const { saleOrderProducts } = this.state;
    const data = saleOrderProducts;

    for (let i = 0; i < data.length; i++) {
      if (record.id === data[i].id) {
        data[i].remarks = e.target.value;
      }
    }

    this.addupAmount(data);
    this.setState({
      saleOrderProducts: data,
    });
  };

  /**
   * 备注
   */
  fetchRemarks = e => {
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
      delete tmp[i].index;
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
   *  添加销售单
   */
  save = () => {
    const { dispatch } = this.props;
    let values = {};
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      values = {
        ...fieldsValue,
        'orderTime': fieldsValue.orderTime.format('YYYY-MM-DD'),

      };

    const {
      amount,
      receivables,
      operatorId,
      pay,
      remarks,
      lableState,
      saleOrderProducts,
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
    if(!operatorId){
      message.warning('请选择员工！');
      return;
    }
    if (saleOrderProducts.length === 0) {
      message.warning('请选择货品');
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
      order_id: values.orderNum, // 订单号  form
      operator_id: operatorId, // 操作员 form
      total_price_final: receivables, // 折后应收form
      total_price: amount, // 合计金额（原价）
      pay, // 支付
      remarks, // 备注
      state: lableState,
      pay_method: values.payMethod, // 支付方式 form
      info: data, // 销售货品
      order_date: values.orderTime, // 订单日期 form
      profit: pay - cost, // 利润
      cost, // 总成本
      customer_id: values.customer[0], // 客户ID form
      customer_name: values.customer[1], // 客户名 form
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

    // console.log(payload)
    dispatch({
      type: 'openbill/addSales',
      payload,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            customerPay:0,
            saleOrderProducts: [],
            payMethodPost: 1,
            amount: 0,
            discount: 100, //  折扣
            receivables: 0, // 折后应收
            pay: 0, // 支付
            customerId: 1,
            customerName: '零售客户',
            expressOrederNum: '未填写',
            expressPay: 0,
            expressInfo: {},
            otherPay: {},
            otherIncome: {},
            goodsCount:0,
            otherPayMoney: 0,
            otherIncomeMoney: 0,
            isArrival: false, // 是否到货
            isBilling: false, // 是否开票
            isArrears: !!Number(localStorage.getItem('defaultPay')), // 是否欠款
            isFreeShipping: false, //  是否包邮
            isRecovery: false, // 是否回收
            isExamine: false, // 是否审核
            isReceivables: false, // 是否收款
            isSend: false, // 是否发货
          });
          this.otherIncome.resetForm();
          this.props.form.resetFields();
          dispatch({
            type: 'product/productListind', // 货品列表
            payload: {
              page: 1,
            },
          });
          dispatch({
            type: 'openbill/fetchOrderNum', // 订单号
          });
          
          dispatch({
            type: 'customer/customerinf',
            payload: {
              page: 1,
            },
          });
        }
      },
    });
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
        const tabledata = saleOrderProducts;
        for (let i = 0; i < searchData.length; i++) {
          window.isExist = false;
          for (let j = 0; j < tabledata.length; j++) {
            if (tabledata[j].id === searchData[i].id) {
              if (tabledata[j].number >= tabledata[j].stock) {
                message.error('货品库存不足');
                return;
              }
              window.isExist = true;
              tabledata[j].number++;
              break;
            }
          }
          if (!window.isExist) {
            if (this.state.customerType === '零售')
              searchData[i].price = searchData[i].retail_price;
            else searchData[i].price = searchData[i].wholesale_price;
            searchData[i].number = 1;
            tabledata.push(searchData[i]);
          }
        }
        this.addupAmount(tabledata);
        this.setState({
          saleOrderProducts: tabledata,
        });
      },
    });
  };

  /**
   * 删除操作
   */
  delGoods = record => {
    const { saleOrderProducts } = this.state;
    const data = saleOrderProducts;
    for (let i = 0; i < data.length; i++) {
      if (record.id === data[i].id) {
        data.splice(i, 1);
      }
    }
    this.addupAmount(data);
    this.setState({
      saleOrderProducts: data,
    });
  }

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
    const receivables = this.props.form.getFieldValue('receivables')
    const {otherPayMoney } = this.state;
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
    const receivables = this.props.form.getFieldValue('receivables')
    const { otherIncomeMoney } = this.state;
    this.setState({
      otherPayMoney: sum,
      otherPay: fields,
      pay: receivables + otherIncomeMoney - sum,
    });
  }


  render() {
    const { goodsCount, orderNum, employeeData, supplierData } = this.state;
    const { form } = this.props;
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

    const pay = (!this.state.customerPay?null:<span style={{ color: 'red' }}>,欠款:{this.state.customerPay}元</span>)


    // 选择客户 props
    const customerMethods = {
      closeCustomer: this.closeCustomer, // 关闭选择客户
      selectCust: this.selectCust, // 点击行选择客户
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
            <img src={record.img_path} alt='货品图片' style={{width:64}} />
            // <div style={{ width: '64px' }} dangerouslySetInnerHTML={{ __html: record.img_path }} />
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
      <PageHeaderWrapper
        title="销售出货"
        action={
          <span>
            <Link to={{ pathname: '/salesDetails/salesSlip'}}>
              <Button className={commonStyle.topButton}><Icon type="snippets" theme="outlined" />销售详情</Button>
            </Link>
          </span>
        }
      >
        <Form className={styles.openbillForm}>
          <Row gutter={8}>
            <Card bordered={false} className={styles.openbillCard}>

              <Col xs={24} sm={12} md={12} lg={8} xl={5} xxl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="单　　号">
                  {form.getFieldDecorator('orderNum', {
                    initialValue:orderNum,
                  })(<span>{orderNum}</span>)}
                </FormItem>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={5} xxl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="操&nbsp;&nbsp;作&nbsp;&nbsp;员">
                  <Select value={this.state.operatorId} placeholder='请选择员工' onChange={this.selectOperator}>{eeOption}</Select>
                </FormItem>           
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={5} xxl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="订单日期">
                  {form.getFieldDecorator('orderTime', {
                    initialValue:moment(),
                  })(
                    <DatePicker
                      allowClear={false}
                      style={{width:'100%'}}
                      disabledDate={this.disabledDate}
                    />
                  )}
                </FormItem> 
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={5} xxl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="客　　户">
                  {form.getFieldDecorator('customer', {
                    initialValue:[this.state.customerId,this.state.customerName],
                  })(
                    <Tooltip placement="topLeft" title={<span>{this.state.customerName}{pay}</span>} arrowPointAtCenter>
                      <Button onClick={this.showCustomer} className={styles.customerButton} block>
                        {this.state.customerName}
                      </Button>
                    </Tooltip>
                  )}
                </FormItem> 
              </Col>

            </Card>
          </Row>

          <Row gutter={4}>
            <Card bordered={false} className={styles.openbillCard}> 

              <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="折后应收">
                  <InputNumber min={0} value={this.state.receivables} step={0.01} onChange={this.receChange} />
                </FormItem>
              </Col>

              <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="折&nbsp;&nbsp;扣&nbsp;&nbsp;率">
                  {form.getFieldDecorator('discount', {
                    initialValue:this.state.discount,
                  })(
                    <InputNumber
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      onChange={this.disChange}
                    />
                  )}
                </FormItem>         
              </Col>

              <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="收款账户">
                  {form.getFieldDecorator('payMethod', {
                    initialValue:this.state.payMethodPost,
                  })(
                    <Select
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
                  )}
                </FormItem>
              </Col>

              <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <Tooltip title={`${this.state.pay}元`}>
                  <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="支付金额">
                    {form.getFieldDecorator('pay', {
                      initialValue:this.state.pay,
                    })(
                      <Tooltip title={`${this.state.pay}元`}>
                        <InputNumber value={this.state.pay} onChange={this.payChange} step={0.01} />
                      </Tooltip>
                    )}
                  </FormItem>
                </Tooltip>
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="实　　收">
                  <span className={styles.orderNum}>{this.state.pay}元</span>
                </FormItem>   
              </Col>

              <Col xs={24} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="默认不支付">
                  <Checkbox
                    className={styles.orderNum}
                    onChange={this.defaultPay}
                    checked={this.state.defaultPay}
                  />   
                </FormItem>        
              </Col>
            </Card> 
          </Row>
        </Form>
        <Card className={commonStyle.rowBackground}>
          <Table
            bordered
            className={commonStyle.tableAdaption}
            columns={saleColumns}
            dataSource={this.state.saleOrderProducts}
            rowKey={record => record.id}
            footer={() => (
              <Row className={styles.openbillForm}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8} style={{ marginTop: 5 }}>
                  <FormItem style={{marginBottom:'0'}} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="条码专用">
                    <Search
                      placeholder="请输入条码或使用扫码枪"
                      onSearch={this.addSaleProduct}
                      style={{width:'100%',marginRight:'5px'}}
                    />
                  </FormItem>
                </Col> 
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8} style={{ marginTop: 5 }}>
                  <FormItem style={{marginBottom:'0',textAlign:'center'}}>
                    <Button onClick={this.save} style={{marginRight:5}} type="primary">　保存　</Button>
                    <Button onClick={this.addGoods}>添加货品</Button>
                  </FormItem>
                </Col>             
                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} style={{ marginTop: 5 }}>
                  <FormItem style={{marginBottom:'0',float:'right'}}>
                    <span className={styles.title} style={{ marginRight: 8 }}>
                      <strong>选择货品</strong>: {goodsCount}
                    </span>
                    <span className={styles.title} style={{position:'relative', marginRight: 8 }}><strong>合计金额</strong>: ￥{this.state.amount}</span>
                  </FormItem>
                </Col>
              </Row>
            )}
            locale={{ emptyText: '请添加货品' }}
          />

        </Card>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={8}>
            <Col xs={24} sm={24} md={24} lg={12} xl={7} xxl={7}>
              <TextArea
                value={this.state.remarks}
                placeholder="备注(最多140字)"
                maxLength={140}
                onChange={this.fetchRemarks}
                autosize={{ minRows: 3, maxRows: 3 }}
              />
            </Col>        
            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
              <div style={{paddingTop:'5px'}}>
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
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 ,xl:18,xxl:32}}>
            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
              <OtherIncomeAndPay {...incomeMethods} />
              <OtherIncomeAndPay {...payMethodPosts} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={7}>
              <Input 
                addonBefore="快递单号:"  
                addonAfter={
                  <div 
                    onClick={this.expressShow} 
                    style={{cursor:'pointer',color:'#1890ff'}} 
                  >
                    填写快递单
                  </div>
                }
                value={this.state.expressOrederNum} 
                disabled={true} 
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={9} xxl={7}>
              <span className={styles.orderNum}>运费金额：{this.state.expressPay}元</span>
            </Col>
          </Row>
        </Card>
        {/* 快递单组件 */ }
        <Express visible={this.state.expressVisible} {...expressMethods} />
        {/* 选择客户组件 */}
        <CustomerModal {...customerMethods} customerVisible={this.state.customerVisible} />
        {/* 选择货品组件 */}
        <AddGoods {...addGoodsMethods} visible={this.state.addGoodsVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default Sellinggoods