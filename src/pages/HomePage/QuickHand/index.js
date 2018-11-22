import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Icon,
  Col,
  Row,
  Steps,
} from 'antd';
import { Link } from 'dva/router';
import styles from '../Guide.less';
import commonStyle from '../../../global.less'; // 公共样式


const {Step} = Steps;

@connect()
class QuickHand extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  render() {

    return (
      <div className={commonStyle['rowBackground-div']}>
        <Row type="flex" justify="space-around" align="middle">
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <span className={styles.title}>快速上手</span>
          </Col>
          <br /><br />
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Steps>
              <Step
                title={<Link to='/storeManagement/storeInformation' style={{color:'#b4b4b4'}}>门店</Link>}
                icon={<Link to='/storeManagement/storeInformation'><Icon type="idcard" theme="outlined" /></Link>}
              />
              <Step
                title={<Link to='/openbill/purchasepurchase' style={{color:'#b4b4b4'}}>采购进货</Link>}
                icon={<Link to='/openbill/purchasepurchase'><Icon type="shopping-cart" theme="outlined" /></Link>}
              />
              <Step
                title={<Link to='/openbill/sellinggoods' style={{color:'#b4b4b4'}}>销售出货</Link>}
                icon={<Link to='/openbill/sellinggoods'><Icon type="shop" theme="outlined"  /></Link>}
              />
              <Step
                title={<Link to='/productManagement/productList' style={{color:'#b4b4b4'}}>查看库存</Link>}
                icon={<Link to='/productManagement/productList'><Icon type="profile" theme="outlined" /></Link>}
              />
            </Steps>
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuickHand
