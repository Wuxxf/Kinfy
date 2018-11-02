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

const StatisticsCard = (props => {
  const {
    title,
    loading,
    backgroundColor,
    number,
  } = props;
  return(
    <Card 
      title={title} 
      bordered={false} 
      className={styles.StatisticsCard}
      hoverable
      loading={loading}
      headStyle={{backgroundColor,}}
      bodyStyle={{backgroundColor,height:'88px'}}
    >
      <p className={styles.static}>￥{number}</p>
    </Card>
  );
})

@connect(({ guide , loading }) => ({
  guide,
  loading:loading.effects['guide/fetch'],
}))
class Guides extends Component {
  state = {
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
        customerPay:nextProps.guide.customerPay , // 客户欠款
        supplierPay:nextProps.guide.supplierPay, // 欠供应商款
        stockNumber:nextProps.guide.stockNumber,    // 当前库存数量
      });


    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  render() {
    const {
      supplierPay,
      salesPay,
      customerPay,
      stockNumber,
      data,
    } = this.state;
    const { loading } = this.props
    if (this.chart) {
      this.chart.forceFit();
    }


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

              <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                <StatisticsCard 
                  title="本月销售收入" 
                  loading={loading}
                  backgroundColor='#fc8556'
                  number={salesPay}
                />
                
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                <Card 
                  title="欠供应商款" 
                  bordered={false} 
                  className={styles.StatisticsCard}
                  hoverable
                  loading={loading}
                  headStyle={{background: '#f8bb39'}}
                  bodyStyle={{backgroundColor:'#f8bb39',height:'88px'}}
                >
                  <p className={styles.static}>￥{supplierPay}</p>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                <Card 
                  title="客户欠款" 
                  bordered={false} 
                  className={styles.StatisticsCard}
                  hoverable
                  loading={loading}
                  headStyle={{background: '#47c056'}}
                  bodyStyle={{backgroundColor:'#47c056',height:'88px'}}
                >
                  <p className={styles.static}>￥{customerPay}</p>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                <Card 
                  title="当前库存数量" 
                  bordered={false} 
                  className={styles.StatisticsCard}
                  hoverable
                  loading={loading}
                  headStyle={{background: '#5b8fd4'}}
                  bodyStyle={{backgroundColor:'#5b8fd4',height:'88px'}}
                >
                  <p className={styles.static}>￥{stockNumber}</p>
                </Card>
              </Col>


              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div className={styles.rowBackground} style={{marginTop:'10px'}}>
                  <Chart   
                    height={400} 
                    data={data} 
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
                    <Axis name="day" line={{stroke: "#E6E6E6"}} title />
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
          <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
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