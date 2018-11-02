import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {
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
  message,
  Tooltip,
  Modal,
  Icon,
  Popconfirm,
  Card,
} from 'antd';

import AddGoods from '@/components/ProductSelect';
import SupplierModal from '@/components/SupplierSelect';
import styles from './index.less';
import commonStyle from '../../global.less'; // 公共样式

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

const FormItem = Form.Item;

// 本地存储 是否默认不支付
if (localStorage.getItem('defaultPay') === null) {
  // 0 不打勾
  localStorage.setItem('defaultPay', 0);
}

// 快递信息
const Express = Form.create()(props => {
  const {
    form,
    visible,
    addExpress, // 添加快递单
    expressClose,
  } = props;

  // 保存
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      addExpress(fieldsValue);
    });
  };
  // 取消
  const onCancel = () => {
    form.resetFields();
    expressClose();
  };

  return (
    <Modal
      visible={visible}
      title="快递信息"
      onCancel={onCancel}
      onOk={okHandle}
      closable={false}
      maskClosable={false}
      keyboard={false}
      okText="保存"
    >
      <Row gutter={16}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="快递运费：">
            {form.getFieldDecorator('express_pay', {
              rules: [{ required: true, message: '请输入快递运费' }],
            })(<InputNumber style={{ width: 152 }} step={0.01} min={0} placeholder="0.00" />)}
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
      </Row>
    </Modal>
  );
});
@connect(({ product, openbill, supplier, store, loading }) => ({
  product,
  openbill,
  supplier,
  store,
  loading: loading.models.openbill,
}))
@Form.create()
class Purchasepurchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNum: '', // 订单号
      employeeData: [], // 操作员
      orderTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 订单时间
      supplierName: '零散供应商', // 供应商名称
      supplierId: 1, // 供应商Id
      supplierVisible: false, // 供应商列表Modal
      receivables: 0, // 折后应付
      discount: 100, // 折扣
      payMethodPost: 1, // 支付账户(Int)
      payMethod: '现金', // 支付账户(String)
      pay: 0, // 支付
      defaultPay: !!Number(localStorage.getItem('defaultPay')), // 是否默认不支付

      saleOrderProducts: [], // 将要销售的货品
      goodsCount: 0, // 将要销售的货品数量
      amount: 0, // 将要销售的合计金额

      expressVisible: false, // 快递信息Modal

      expressPay: 0, // 快递运费
      expressInfo: {}, // 快递信息默认值
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchPurcNum', // 订单号
    });

    dispatch({
      type: 'supplier/supplierinf', // 供应商列表
      payload: {
        page: 1,
      },
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
    this.setState(
      {
        supplierName: value.name,

        supplierId: value.id, // 供应商ID

        supplierPay: value.pay,

        supplierVisible: false,
      },
      () => {
        const { saleOrderProducts } = this.state;

        this.setState({
          saleOrderProducts,
        });

        this.addupAmount(saleOrderProducts);
      }
    );
  };

  /**
   * 折后应付
   */
  receChange = e => {
    const { defaultPay } = this.state;

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
        receivables: e, // 折后应付
        pay: 0,
        discount: dis,
        // collect:0,
      });
    } else {
      this.setState({
        receivables: e, // 折后应付
        pay: e,
        discount: dis,
        // collect:e,
      });
    }
  };

  /**
   * 折扣
   */

  disChange = e => {
    const { defaultPay } = this.state;

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

    if (defaultPay) {
      this.setState({
        discount: e, // 折扣率
        receivables: rece,
        pay: 0,
        // collect:0,
      });
    } else {
      this.setState({
        discount: e, // 折扣率
        receivables: rece,
        pay: rece,
        // collect:rece,
      });
    }
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
    const { defaultPay } = this.state;

    if (isNaN(e) || defaultPay) {
      e = 0;
    }

    this.setState({
      pay: e,
      // collect:e,
    });
  };

  /**
   * 默认不支付
   */
  defaultPay = () => {
    const { defaultPay, receivables } = this.state;

    this.setState(
      {
        defaultPay: !defaultPay,
      },
      () => {
        if (defaultPay) {
          localStorage.setItem('defaultPay', 0);
          this.setState({
            pay: receivables,
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
   * 关闭添加货品
   */
  addGoodsClose = () => {
    this.setState({
      addGoodsVisible: false,
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
          window.isExist = true;

          saleOrderProducts[j].number++;
          break;
        }
      }
      if (!window.isExist) {
        goods[i].price = goods[i].purchase_cost;
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
   * 计算合计金额
   */
  addupAmount = tableData => {
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

    if (this.state.defaultPay) {
      this.setState({
        pay: 0,
        // collect:0,
      });
    } else {
      this.setState({
        pay: count,
        // collect:count,
      });
    }
  };

  /**
   * 修改单价
   */

  changePrice = (record, e) => {
    const { saleOrderProducts } = this.state;

    for (let i = 0; i < saleOrderProducts.length; i++) {
      if (record.id === saleOrderProducts[i].id) {
        if (isNaN(e)) {
          saleOrderProducts[i].price = 0;
          break;
        }

        saleOrderProducts[i].price = e;
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
   *  采购进货
   */
  saleGoods = () => {
    const { dispatch } = this.props;

    const {
      orderTime,
      orderNum,
      operatorId,
      receivables,
      amount,
      pay,
      remarks,
      payMethodPost,
      saleOrderProducts,
      supplierId,
      expressInfo,
      goodsCount,
      expressPay,
      state,
    } = this.state;
    if(!operatorId){
      message.warning('请选择操作员');
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
      order_id: orderNum, // 订单号
      operator_id: operatorId, // 操作员
      total_price_final: receivables, // 折后应付
      total_price: amount, // 合计金额（原价）
      pay, // 支付
      remarks, // 备注
      number: goodsCount, // 将要销售的货品数量
      pay_method: payMethodPost, // 支付方式
      info: data, // 销售货品
      order_date: orderTime, // 订单日期
      state,
      cost, // 总成本
      supplier_id: supplierId, // 供应商ID
      express_pay_method:expressInfo.pay_method,
      express_pay: expressPay, // 快递运费
      // express: expressInfo, // 快递信息
     
    };

    dispatch({
      type: 'openbill/addPurchasing',
      payload,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            saleOrderProducts: [],
            payMethodPost: 1,
            payMethod: '现金',
            supplierId: 1,
            supplierName: '零散供应商',
            supplierPay: 0,
            amount: 0,
            remarks: '',
            goodsCount: 0,
            discount: 100, //  折扣
            receivables: 0, // 折后应付
            pay: 0, // 支付
            expressPay: 0,
            expressInfo: {},
          });
          dispatch({
            type: 'product/productListind', // 货品列表
            payload: {
              page: 1,
            },
          });
          dispatch({
            type: 'supplier/supplierinf', // 供应商列表
            payload: {
              page: 1,
            },
          });
          dispatch({
            type: 'openbill/fetchPurcNum', // 订单号
          });
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
            searchData[i].price = searchData[i].purchase_cost;
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
  };

  /**
   * 快递信息
   */
  expressShow = () => {
    this.setState({
      expressVisible: true,
    });
  };

  /**
   * 关闭快递信息
   */
  expressClose = () => {
    this.setState({
      expressVisible: false,
    });
  };

  /**
   * 快递信息详情
   */
  addExpress = fieldsValue => {
    if (fieldsValue.expressCompany) fieldsValue.company_id = fieldsValue.expressCompany.key;

    delete fieldsValue.expressCompany;
    this.setState({
      expressVisible: false,
      expressInfo: fieldsValue,
      expressPay: fieldsValue.express_pay,
    });
  };

  isArrival = e => {
    this.setState({
      state: Number(e.target.checked),
    });
  };

  render() {
    const { supplierData, goodsCount, orderNum, employeeData } = this.state;

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
      return <span style={{ color: 'red' }}> 欠款:{this.state.supplierPay}元</span>;
    };

    // 选择供应商 props
    const supplierMethods = {
      closeSupplier: this.closeSupplier,
      selectCust: this.selectCust,
    };

    //  添加货品  props
    const addGoodsMethods = {
      addGoodsClose: this.addGoodsClose,
      addSelectGoods: this.addSelectGoods,
      supplierData,
      isReturn: true,
    };

    // 快递信息props
    const expressMethods = {
      expressClose: this.expressClose,
      expressCompany: this.state.expressCompany,
      addExpress: this.addExpress,
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
            min={1}
            value={record.number}
            style={{ width: 100 }}
            onChange={e => this.changeNumber(record, e)}
          />
        ),
      },
      {
        title: '采购单价',
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
              <span>供&nbsp;&nbsp;应&nbsp;&nbsp;商: </span>
              <Button onClick={this.showSupplier} style={{ width: '130px' }}>
                {this.state.supplierName}
              </Button>
              <Pay />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={{ span: 3, push: 1 }} style={{ marginTop: 5 }}>
              <Link to="/purchaseDetail/shippingOrder">
                <Button className={commonStyle.topButton}><Icon type="snippets" theme="outlined" />采购明细</Button>
              </Link>
            </Col>
          </Row>
        </Card>

        <SupplierModal {...supplierMethods} supplierVisible={this.state.supplierVisible} />

        <Card className={commonStyle.rowBackground}>
          <Row gutter={4}>
            <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
              <span>折后应付: </span>
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
              <span>付款账户: </span>
              <Select
                labelInValue
                onSelect={this.payMethodSelect}
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
              <Checkbox
                className={styles.orderNum}
                onChange={this.defaultPay}
                checked={this.state.defaultPay}
              >
                默认不支付
              </Checkbox>
            </Col>
          </Row>
        </Card>

        <Card className={commonStyle.rowBackground}>
          <Table
            className={commonStyle.tableAdaption}
            columns={saleColumns}
            dataSource={this.state.saleOrderProducts}
            rowKey={record => record.id}
            locale={{ emptyText: '请添加货品' }}
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
                <Button onClick={this.addGoods}>
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
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={8}>
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
        <Card className={commonStyle.rowBackground}>
          <Row>
            <Express visible={this.state.expressVisible} {...expressMethods} />
            <Col xs={12} sm={8} md={4} lg={4} xl={3} xxl={3}>
              <Button type="dashed" onClick={this.expressShow} style={{ color: '#0f91e7' }}>
                填写运费支出
              </Button>
            </Col>
            <Col xs={12} sm={8} md={6} lg={6} xl={4} xxl={4}>
              <span className={styles.orderNum}>运费金额：{this.state.expressPay}元</span>
            </Col>
            <Col xs={12} sm={8} md={6} lg={6} xl={4} xxl={2}>
              <Checkbox style={{ marginTop: 5 }} onChange={this.isArrival} defaultChecked>
                已到货
              </Checkbox>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
export default Purchasepurchase