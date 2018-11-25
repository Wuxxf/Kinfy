import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
} from 'antd';
import Notice from './Notice';
import QuickHand from './QuickHand';
import CommonlyUsed from './CommonlyUsed';
import Charts from './Charts';
import StatisticsCard from './StatisticsCard';

@connect(({ guide }) => ({
  guide,
}))
class Guides extends Component {
  state = {
    chartData:[],
    notice:[],
    commonlyUsed:[],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'guide/fetch',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { guide } = this.props;

    if (nextProps.guide !== guide) {
      const {
        notice
      } = nextProps.guide;
      notice.push({title:'更多···'})
      this.setState({
        chartData: nextProps.guide.data,
        notice,                                     // 公告
        salesPay:nextProps.guide.salesPay,          // 本月销售收入
        customerPay:nextProps.guide.customerPay ,   // 客户欠款
        supplierPay:nextProps.guide.supplierPay,    // 欠供应商款
        stockNumber:nextProps.guide.stockNumber,    // 当前库存数量
        commonlyUsed:nextProps.guide.commonlyUsed,
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
      chartData,
      notice,
      commonlyUsed,
    } = this.state;

    const statisticsProps = {
      supplierPay,
      salesPay,
      customerPay,
      stockNumber,
    }

    return (
      <div>
        <Row gutter={18}>
          <Col xs={24} sm={24} md={24} lg={24} xl={19} xxl={19}>
            <Row gutter={18}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <QuickHand />
              </Col>
              <StatisticsCard {...statisticsProps} />
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Charts chartData={chartData} />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={5} xxl={5}>
            <Notice notice={notice} />
            <CommonlyUsed commonlyUsed={commonlyUsed} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Guides
