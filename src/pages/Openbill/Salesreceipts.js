import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Select,
  Form,
  DatePicker,
  Button,
  Input,
  InputNumber,
  message,
  Tooltip,
  Icon,
  Card,
  Table,
} from 'antd';
import CustomerModal from '@/components/CustomerSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
class Salesreceipts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNum: '',
      orderTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 订单时间
      customerVisible: false,
      customerName: props.location.state ? props.location.state.name : '　',
      customerId: props.location.state ? props.location.state.id : null,
      payMethod: '现金',
      payMethodPost: 1,
      pay: 0, // 收款
      expandesRowKey: [],
      dataSource:[],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'openbill/fetchReceNum', // 收款订单号
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

  onExpand = (expanded, record) =>{
    if(expanded)
      this.props.dispatch({
        type: 'openbill/fetchSalesDetail',
        payload: {
          id: record.id,
        },
        callback: res => {
          if (res.errcode) {
            message.error('不好！好像出错了！');
          } else {
            this.setState({
              expandesRowData: res.data[0].info,
              expandesRowKey:[record.id],
            });
          }
        },
      });   
    else{
      this.setState({
        expandesRowKey:[],
      })
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
    this.props.dispatch({
      type: 'openbill/fetchCustArrears', // 收款关联单
      payload:{
        id:value.id,
      },
      callback:(res)=>{
        if(res.errcode){
          message.error(res.msg);
        }else{
          this.setState({
            dataSource:res.data,
            isSelect:true,
          })
        }
        // console.log(res.data)
      },
    });

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
  }


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
    } = this.state;
    if (!customerId) {
      message.error('请选择客户！');
      return;
    }
    if(!operatorId){
      message.warning('请选择操作员');
      return;
    }
    const payload = {
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
      type: 'openbill/receiptAdd', // 订单号
      payload,
      callback: res => {
        if (res.errcode) message.error(res.msg);
        else {
          message.success(res.msg);
          this.props.dispatch({
            type: 'openbill/fetchReceNum', // 收款订单号
          });
          this.setState({
            pay: 0,
            payMethodPost: 1,
            payMethod: '现金',
            customerId: 1, // 客户ID
            customerName: '零售客户', // 客户名
            remarks: '',
          });
        }
      },
    });

    console.log(payload);
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

    const CustPay = (props) =>{
      if(props.isSelect){
        return(
          <Table
            className={`${commonStyle.tableAdaption} ${styles.tableDetail}`}
            onExpand={(expanded,record)=>this.onExpand(expanded, record)}
            rowKey={record => record.id}
            expandedRowRender={this.expandedRowRender}
            expandedRowKeys={this.state.expandesRowKey}
            pagination={false} 
            rowSelection={rowSelection} 
            columns={columns} 
            dataSource={this.state.dataSource} 
          />
        )
      }else{
        return <div className={styles.tableEmpty}>请先在上方选择还款客户</div>
      }
    }

    const columns = [{
      title: '订单号',
      dataIndex: 'order_id',
      key: 'order_id',
    }, {
      title: '客户',
      dataIndex: 'customer.name',
      key: 'customer.name',
    }, {
      title: '订单时间 ',
      dataIndex: 'order_date',
      key: 'order_date',
    },{
      title: '折后应收',
      dataIndex: 'total_price_final',
      key: 'total_price_final',
    },{
      title: '欠款金额',
      dataIndex: 'arrearsPay',
      key: 'arrearsPay',
      render:(text,record)=>{
        return record.total_price_final+record.other_income_price-record.other_pay_price-record.pay
      },
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const len  = selectedRows.length;
        let pay = 0;
        for(let i = 0 ; i < len ; i++ ){
          pay += selectedRows[i].total_price_final
          +selectedRows[i].other_income_price
          -selectedRows[i].other_pay_price-selectedRows[i].pay
        }
        this.setState({
          selectedRowKeys,
          pay,
        })
        // console.log(selectedRows);
        
      },
      selectedRowKeys: this.state.selectedRowKeys,
    };


    return (
      <PageHeaderWrapper title='销售收款'>
        <Card className={commonStyle.rowBackground}>
          <Row gutter={18}>
            <Col xs={24} sm={12} md={12} lg={12} xl={4} xxl={4} style={{ marginTop: 5 }}>
              <span>单　　号: </span>
              <span className={styles.orderNum}>{this.state.orderNum}</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={4} xxl={4} style={{ marginTop: 5 }}>
              <span>操&nbsp;&nbsp;作&nbsp;&nbsp;员: </span>
              <Select style={{ width: 120 }} onChange={this.selectOperator}>
                {eeOption}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={4} xxl={4} style={{ marginTop: 5 }}>
              <span>订单日期: </span>
              <DatePicker
                allowClear={false}
                style={{ width: 120 }}
                defaultValue={moment()}
                onChange={this.orderTime}
                disabledDate={this.disabledDate}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={4} style={{ marginTop: 5 }}>
              <span>客　　户: </span>
              <Tooltip placement="topLeft" title={this.state.customerName} arrowPointAtCenter>
                <Button onClick={this.showCustomer} className={styles.customerButton}>
                  {this.state.customerName}
                </Button>
              </Tooltip> 
              <Pay />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} xxl={{span:5,push:3}} style={{ marginTop: 5 }}>
              <Link to="/salesDetails/returnForm">
                <Button className={commonStyle.topButton}><Icon type="snippets" theme="outlined" />销售明细</Button>
              </Link> 
              <Button type="primary" onClick={this.save} style={{ width: '120px' ,marginLeft:'2px'}}>
                保存
              </Button>
            </Col>
          </Row>
        </Card>
        <CustomerModal {...customerMethods} customerVisible={this.state.customerVisible} />
        <Card className={commonStyle.rowBackground}>
          <Row gutter={4}>
            <Col xs={24} sm={12} md={12} lg={12} xl={5} xxl={5}>
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
            <Col xs={24} sm={12} md={12} lg={12} xl={5} xxl={5}>
              <span>{this.state.payMethod}收款: </span>
              <InputNumber
                value={this.state.pay}
                onChange={this.payChange}
                step={0.01}
                style={{ width: 120 }}
              />
            </Col>
            
          </Row>
          <Row style={{ paddingTop: 10 }}>
            <Col span={10}>
              <TextArea
                onChange={this.changeRemarks}
                placeholder="备注(最多200字)"
                maxLength={200}
                autosize={{ minRows: 6, maxRows: 6 }}
              />
            </Col>
          </Row>
        </Card>
        <Card className={commonStyle.rowBackground} style={{padding:0}}>
          <Row>
            <Col span={24} style={{padding:10,backgroundColor:'#e6e6e6',textAlign:'center'}}>
              客户欠款单据
            </Col>
            <Col span={24}>
              <CustPay isSelect={this.state.isSelect} />
            </Col>
          </Row>
        </Card>
       
      </PageHeaderWrapper>
    );
  }
}
export default Salesreceipts