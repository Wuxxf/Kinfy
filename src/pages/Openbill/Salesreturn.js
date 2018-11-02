import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {
  Icon,
  Row,
  Col,
  Select,
  Form,
  DatePicker,
  Button,
  Input,
  Table,
  InputNumber,
  message,
  Tooltip,
  Card,
  Popconfirm,
} from 'antd';

import AddGoods from '@/components/ProductSelect';
import CustomerModal from '@/components/CustomerSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';
import commonStyle from '../../global.less'; // 公共样式

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;
const FormItem = Form.Item;
@connect(({ openbill, store, supplier, loading }) => ({
  openbill,
  store,
  supplier,
  loading: loading.models.openbill,
}))
@Form.create()
class Salesreturn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNum: '', // 订单号
      employeeData: [], // 操作员
      orderTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 订单时间
      customerName: '零售客户', // 客户名称
      customerType: '零售', // 客户类型
      customerId: 1, // 客户Id
      customerVisible: false, // 客户列表Modal
      receivables: 0, // 折后应退
      discount: 100, // 折扣
      payMethodPost: 1, // 支付账户(Int)
      pay: 0, // 支付

      saleOrderProducts: [], // 将要销售的货品
      goodsCount: 0, // 将要销售的货品数量
      amount: 0, // 将要销售的合计金额
      categoryData: [], // 货品类别
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchReturnOrderNum', // 订单号
    });

    dispatch({
      type: 'store/fetchEmployee', // 员工列表
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
        const tabledata =saleOrderProducts;

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
   * 折后应退
   */
  receChange = e => {
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

    this.setState({
      receivables: e, // 折后应退
      pay: e,
      discount: dis,
    });
  };

  /**
   * 折扣
   */
  disChange = e => {
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

    this.setState({
      discount: e, // 折扣率
      receivables: rece,
      pay: rece,
    });
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
    if (isNaN(e)) {
      e = 0;
    }

    this.setState({
      pay: e,
    });
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
      pay: count,
    });
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
   *  添加销售单
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
      lableState,
      payMethodPost,
      saleOrderProducts,
      customerId,
      customerName, // 客户名
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
      total_price_final: receivables, // 折后应退
      total_price: amount, // 合计金额（原价）
      pay, // 支付
      remarks, // 备注
      state: lableState,
      pay_method: payMethodPost, // 支付方式
      info: data, // 销售货品
      order_date: orderTime, // 订单日期
      customer_name: customerName, // 客户名
      profit: pay - cost, // 利润
      cost, // 总成本
      customer_id: customerId, // 客户ID
    };
    // console.log(payload);
    dispatch({
      type: 'openbill/addSalesReturn',
      payload,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            goodsCount:0,
            saleOrderProducts: [],
            payMethodPost: 1,
            amount: 0,
            discount: 100, //  折扣
            receivables: 0, // 折后应退
            pay: 0, // 支付
            customerId: 0,
            remarks: '',
            customerName: '零售客户',
          });
          dispatch({
            type: 'product/productListind', // 货品列表
            payload: {
              page: 1,
            },
          });
          dispatch({
            type: 'openbill/fetchReturnOrderNum', // 订单号
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
        searchData.push(res.data);
        if (searchData.length === 0) {
          message.error('货品不存在');
          return;
        }
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
  };

  render() {
    const { goodsCount, orderNum, employeeData, supplierData, categoryData } = this.state;

    // 类别树结构 数组
    const categoryTreeData = [];
    if (categoryData.length !== 0) {
      for (let i = 0; i < categoryData.length; i += 1) {
        categoryData[i].children = [];
      }

      this.categoryDatafun(categoryData, 1, 0);

      categoryTreeData.push(categoryData[0]);
    }

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
      closeCustomer: this.closeCustomer,
      selectCust: this.selectCust,
    };

    //  添加货品  props
    const addGoodsMethods = {
      addGoodsClose: this.addGoodsClose,
      addSelectGoods: this.addSelectGoods,
      supplierData,
    };

    // 销售货品表头
    const saleColumns = [
      {
        title: '货品图片',
        dataIndex: 'img_path',
        key: 'img_path',
        render: (text, record) => {
          return (
            <img src={record.img_path} alt='货品图片' /> 
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
        title="销售退货"
        action={
          <span>
            <Link to="/salesDetails/returnForm">
              <Button className={commonStyle.topButton}><Icon type="snippets" theme="outlined" />销售明细</Button>
            </Link>
          </span>
        }
      >
        <Form className={styles.openbillForm}>
          <Card bordered={false} className={styles.openbillCard}>
            <Row gutter={8}>
              <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="单　　号">
                  <span className={styles.orderNum}>{orderNum}</span>
                </FormItem>      
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="操&nbsp;&nbsp;作&nbsp;&nbsp;员">
                  <Select style={{ width: 130 }} onChange={this.selectOperator}>
                    {eeOption}
                  </Select>
                </FormItem>       
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="订单日期">
                  <DatePicker
                    allowClear={false}
                    style={{ width: 130 }}
                    defaultValue={moment()}
                    onChange={this.orderTime}
                    disabledDate={this.disabledDate}
                  />
                </FormItem>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={5} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="客　　户">
                  <Tooltip placement="topLeft" title={<span>{this.state.customerName}{pay}</span>} arrowPointAtCenter>
                    <Button onClick={this.showCustomer} className={styles.customerButton} block>
                      {this.state.customerName}
                    </Button>
                  </Tooltip>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card bordered={false} className={styles.openbillCard}>
            <Row gutter={4}>
              <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="折后应退">
                  <InputNumber value={this.state.receivables} step={0.01} onChange={this.receChange} />
                </FormItem>
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="折&nbsp;&nbsp;扣&nbsp;&nbsp;率">
                  <InputNumber
                    value={this.state.discount}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    onChange={this.disChange}
                  />
                </FormItem>
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="退款账户">
                  <Select
                    labelInValue
                    onSelect={this.payMethodSelect}
                    value={{ key: this.state.payMethodPost }}
                    style={{ width: '100%' }}
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
                </FormItem>
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={4} style={{ marginTop: 5 }}>
                <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="支付金额">
                  <Tooltip title={`${this.state.pay}元`}>
                    <InputNumber value={this.state.pay} min={0} onChange={this.payChange} step={0.01} />
                  </Tooltip>
                </FormItem>
              </Col>
            </Row>
          </Card>

        </Form>

        <Card className={commonStyle.rowBackground}>
          <Table
            bordered
            className={commonStyle.tableAdaption}
            columns={saleColumns}
            dataSource={this.state.saleOrderProducts}
            rowKey={record => record.id}
            locale={{ emptyText: '请添加货品' }}
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
                    <Button type="primary" onClick={this.saleGoods} style={{marginRight:5}}>　保存　</Button>
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
          />
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
        <CustomerModal {...customerMethods} customerVisible={this.state.customerVisible} />
        <AddGoods {...addGoodsMethods} isReturn={true} visible={this.state.addGoodsVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default Salesreturn