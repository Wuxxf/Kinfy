import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Icon,
  Card,
  List,
  Steps,
} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";


import styles from './Guide.less';

const {Step} = Steps;


@connect(({ guide }) => ({
  guide,
}))
class Guides extends Component {
  state = {
    
    salesKey: 'sales',
    // capitalPay:1241,// 资金余额
    
    capitalKey: 'customerPay',
    
    stockKey:'stockNumber',

    data:[],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'guide/fetch', 
    });
    // dispatch({
    //   type: 'openbill/querySaleSlip', // 获取单据
    // });
  }

  componentWillReceiveProps(nextProps) {
    const { guide } = this.props;
    if (nextProps.guide !== guide) {
      this.setState({
        data: nextProps.guide.data,
        salesPay:nextProps.guide.salesPay,  // 本月销售收入
        receiptPay:nextProps.guide.receiptPay,// 本月销售收款
        salesNumber:nextProps.guide.salesNumber,// 本月销售数量
        customerPay:nextProps.guide.customerPay , // 客户欠款
        supplierPay:nextProps.guide.supplierPay, // 欠供应商款
        stockNumber:nextProps.guide.stockNumber,    // 当前库存数量
        stockPay:nextProps.guide.stockPay, // 当前库存成本
      });


    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  render() {
    const { loading } = this.props
    if (this.chart) {
      this.chart.forceFit();
    }
    // 销售
    const SalesTabList = [{
      key: 'sales',
      tab: '本月销售收入',
    }, {
      key: 'receipt',
      tab: '本月销售收款',
    }, {
      key: 'number',
      tab: '本月销售数量',
    }];
    const contentListSales = {
      sales: <p className={styles.static}>￥{this.state.salesPay}</p>,
      receipt: <p className={styles.static}>￥{this.state.receiptPay}</p>,
      number: <p className={styles.static}>{this.state.salesNumber}</p>,
    };
    // 资金
    const CapitalTabList = [
    // {
    //   key: 'capital',
    //   tab: '资金余额',
    // }, 
    {
      key: 'customerPay',
      tab: '客户欠款',
    }, {
      key: 'supplierPay',
      tab: '欠供应商款',
    }];
    const contentListcapital = {
      // capital: <p className={styles.static}>￥{this.state.capitalPay}</p>,
      customerPay: <p className={styles.static}>￥{this.state.customerPay}</p>,
      supplierPay: <p className={styles.static}>￥{this.state.supplierPay}</p>,
    };
    // 库存
    const StockTabList = [{
      key: 'stockNumber',
      tab: '当前库存数量',
    }, {
      key: 'stockPay',
      tab: '当前库存成本',
    }];
    const contentListstock = {
      stockNumber: <p className={styles.static}>{this.state.stockNumber}</p>,
      stockPay: <p className={styles.static}>￥{this.state.stockPay}</p>,
    };

    const listData =  [
      {
        id:1,
        title:'待审核',
        content:0,
      },
      {
        id:2,
        title:'待记账',
        content:0,
      },
    ];

    const cols = {
      value: {
        alias:'销售额',
        min: 0,
      },
      day: {
        alias:'日',
        range: [0, 1],
      },

    };

    return (
      <div>  
        <Row gutter={18}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
            <Row gutter={18}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div className={styles.rowBackground}>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                      <span className={styles.quickHand}>快速上手</span>
                    </Col>
                    <br /><br />
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                      <Steps>
                        <Step 
                          status="wait" 
                          title={<Link to='/storeManagement/storeInformation' style={{color:'#b4b4b4'}}>门店</Link>}
                          icon={<Link to='/storeManagement/storeInformation'><Icon type="idcard" theme="outlined" /></Link>}
                        />
                        <Step 
                          status="wait" 
                          title={<Link to='/openbill/purchasepurchase' style={{color:'#b4b4b4'}}>采购进货</Link>} 
                          icon={<Link to='/openbill/purchasepurchase'><Icon type="shopping-cart" theme="outlined" /></Link>} 
                        />
                        <Step 
                          status="wait" 
                          title={<Link to='/openbill/sellinggoods' style={{color:'#b4b4b4'}}>销售出货</Link>} 
                          icon={<Link to='/openbill/sellinggoods'><Icon type="shop" theme="outlined"  /></Link>} 
                        />
                        <Step 
                          status="wait" 
                          title={<Link to='/productManagement/productList' style={{color:'#b4b4b4'}}>查看库存</Link>} 
                          icon={<Link to='/productManagement/productList'><Icon type="profile" theme="outlined" /></Link>} 
                        />
                      </Steps>
                    </Col> 
                  </Row>
                </div>
              </Col> 
              <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                <Card
                  className={styles.myCard}
                  loading={loading}
                  headStyle={{backgroundColor:'#fba562'}}
                  bodyStyle={{backgroundColor:'#fba562',height:'118px'}}
                  style={{ width: '100%'}}
                  tabList={SalesTabList}
                  activeTabKey={this.state.salesKey}
                  onTabChange={(key) => { this.onTabChange(key, 'salesKey'); }}
                >
                  {contentListSales[this.state.salesKey]}
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                <Card
                  className={styles.myCard}
                  loading={loading}
                  headStyle={{backgroundColor:'#46c354'}}
                  bodyStyle={{backgroundColor:'#46c354',height:'118px'}}
                  style={{ width: '100%'}}
                  tabList={CapitalTabList}
                  activeTabKey={this.state.capitalKey}
                  onTabChange={(key) => { this.onTabChange(key, 'capitalKey'); }}
                >
                  {contentListcapital[this.state.capitalKey]}
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                <Card
                  className={styles.myCard}
                  loading={loading}
                  headStyle={{backgroundColor:'#5a91d3'}}
                  bodyStyle={{backgroundColor:'#5a91d3',height:'118px'}}
                  style={{ width: '100%'}}
                  tabList={StockTabList}
                  activeTabKey={this.state.stockKey}
                  onTabChange={(key) => { this.onTabChange(key, 'stockKey'); }}
                >
                  {contentListstock[this.state.stockKey]}
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div className={styles.rowBackground} style={{marginTop:'10px'}}>
                  <Chart   
                    height={400} 
                    data={this.state.data} 
                    scale={cols} 
                    forceFit 
                    padding="auto"
                    onGetG2Instance={(chart) => {
                      this.chart = chart;
                    }} 
                  >
                    <span className={styles.quickHand}>
                      本月销售收入
                    </span>
                    <Axis name="day" title  line={{stroke: "#E6E6E6"}} />
                    <Axis name="value" line={{stroke: "#E6E6E6"}}  />
                    <Tooltip
                      crosshairs={{
                        type: "y",
                      }}
                    />
                    <Geom type="line" shape="smooth" position="day*value" size={2} />
                  </Chart>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6} >
            <div className={styles.rowBackground}>
              <List
                size="large"
                style={{height:'718px',overflow:'auto'}}
                header={<div className={styles.quickHand}>待办事项</div>}
                // bordered
                dataSource={listData}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      title={<Link to='/openbill/sellinggoods'>{item.title}</Link>}
                    />
                    <div>{item.content}</div>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>

      </div>
    );
  }
}

export default Guides