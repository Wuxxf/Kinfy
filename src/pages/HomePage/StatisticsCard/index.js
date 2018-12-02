import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import Yuan from '@/utils/Yuan';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import {
  Col,
  Card,
} from 'antd';
import styles from '../Guide.less';

@connect()
class StatisticsCard extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  render() {
    const {
      salesPay,
      supplierPay,
      customerPay,
      stockNumber,
    } = this.props;

    return (
      <QueueAnim delay={300}>
        <Col key="1" xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <Card
            title="本月销售收入"
            bordered={false}
            className={styles.StatisticsCard}
            hoverable
            headStyle={{background: '#fc8556'}}
            bodyStyle={{backgroundColor:'#fc8556',height:'88px'}}
            onClick={()=>this.props.dispatch(routerRedux.push('/salesDetails/salesSlip'))}
          >
            <div className={styles.static}><Yuan>{salesPay}</Yuan></div>
          </Card>
        </Col>
        <Col key="2" xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <Card
            title="欠供应商款"
            bordered={false}
            className={styles.StatisticsCard}
            hoverable
            headStyle={{background: '#f8bb39'}}
            bodyStyle={{backgroundColor:'#f8bb39',height:'88px'}}
            onClick={()=>this.props.dispatch(routerRedux.push('/supplierManagement/supplierManagement'))}
          >
            <div className={styles.static}><Yuan>{supplierPay}</Yuan></div>
          </Card>
        </Col>
        <Col key="3" xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <Card
            title="客户欠款"
            bordered={false}
            className={styles.StatisticsCard}
            hoverable
            headStyle={{background: '#47c056'}}
            bodyStyle={{backgroundColor:'#47c056',height:'88px'}}
            onClick={()=>this.props.dispatch(routerRedux.push('/customerManagement/customerManagement'))}
          >
            <div className={styles.static}><Yuan>{customerPay}</Yuan></div>
          </Card>
        </Col>
        <Col key="4" xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <Card
            title="当前库存数量"
            bordered={false}
            className={styles.StatisticsCard}
            hoverable
            headStyle={{background: '#5b8fd4'}}
            bodyStyle={{backgroundColor:'#5b8fd4',height:'88px'}}
            onClick={()=>this.props.dispatch(routerRedux.push('/productManagement/productList'))}
          >
            <div className={styles.static}>{stockNumber}</div>
          </Card>
        </Col>
      </QueueAnim>
    );
  }
}

export default StatisticsCard
