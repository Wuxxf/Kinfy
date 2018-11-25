import React, { Component } from 'react';
import {
  Col,
  Row,
  List,
  Checkbox,
  message,
} from 'antd';
import styles from './index.less'

class AllUsed extends Component {
  constructor(props){
    super(props)

    const { selectedUsed } =props
    // 处理已选择功能数组
    const selected = [];
    for (let i = 0; i < selectedUsed.length; i++) {
      const obj = Object.assign({},selectedUsed[i])
      delete obj.id; delete obj.user_id;
      const str = JSON.stringify(obj)
      selected.push(str)
    }
    this.state={
      selected,
    }
  }

  onChange = (checkedValues) => {

    if(checkedValues.length >8){
      checkedValues.splice(8,1)
      message.warning("选择8个最为合适")
      return;
    }

    const tmp = [];
    for (let i = 0; i < checkedValues.length; i++) {
       const obj = JSON.parse(checkedValues[i])
       tmp.push(obj)
    }

    this.props.callback(tmp)

  }

 render() {
  const data = [
    {
      name:'销售出货',
      icon_name:'icon-3',
      route:'/openbill/sellinggoods',
    },
    {
      name:'销售退货',
      icon_name:'icon-3',
      route:'/openbill/salesreturn',
    },
    {
      name:'销售收款',
      icon_name:'icon-13',
      route:'/openbill/salesreceipts',
    },
    {
      name:'采购付款',
      icon_name:'icon-16',
      route:'/openbill/purchasepayment',
    },
    {
      name:'采购进货',
      icon_name:'icon-21',
      route:'/openbill/purchasepurchase',
    },
    {
      name:'采购退货',
      icon_name:'icon-21',
      route:'/openbill/purchasereturn',
    },
  ];
  const data2 = [
    {
      name:'销售单据',
      icon_name:'icon-2',
      route:'/salesDetails/salesSlip',
    },
    {
      name:'收款单据',
      icon_name:'icon-13',
      route:'/salesDetails/receipt',
    },
    {
      name:'进货单据',
      icon_name:'icon-2',
      route:'/purchaseDetail/shippingOrder',
    },
    {
      name:'付款单据',
      icon_name:'icon-16',
      route:'/purchaseDetail/paymentForm',
    },
    {
      name:'收入单据',
      icon_name:'icon-13',
      route:'/balanceOfPayments/revenueManagement',
    },
    {
      name:'支出单据',
      icon_name:'icon-16',
      route:'/balanceOfPayments/expenditureManagement',
    },
  ];
  const data3 = [
    {
      name:'门店管理',
      icon_name:'icon-11',
      route:'/storeManagement/storeInformation',
    },
    {
      name:'客户管理',
      icon_name:'icon-10',
      route:'/customerManagement/customerManagement',
    },
    {
      name:'供应商管理',
      icon_name:'icon-10',
      route:'/supplierManagement/supplierManagement',
    },
    {
      name:'员工管理',
      icon_name:'icon-17',
      route:'/storeManagement/employeeManagement',
    },
    {
      name:'货品管理',
      icon_name:'icon-5',
      route:'/productManagement/productList',
    },
    {
      name:'公告管理',
      icon_name:'icon-1',
      route:'/storeManagement/bulletinManagement',
    },

  ];
  const data4 = [
    {
      name:'销售统计',
      icon_name:'icon-14',
      route:'/reportForm/salesStatistics',
    },
    {
      name:'采购统计',
      icon_name:'icon-7',
      route:'/reportForm/purchaseStatistics',
    },
    {
      name:'利润统计',
      icon_name:'icon-15',
      route:'/reportForm/profitStatistics',
    },
    {
      name:'标签设置',
      icon_name:'icon-12',
      route:'/customerManagement/labelSetting',
    },
  ];

    return (
      <div>
        <Row>
          <div className={styles.tabsetwrap}>
            <Checkbox.Group style={{ width: '100%' }} defaultValue={this.state.selected} onChange={this.onChange}>
              <Col xs={24} md={6}>
                <div className={styles.tabsetitem}>
                  <List
                    header={<div className={styles.tabsettitle}>开单</div>}
                    dataSource={data}
                    renderItem={
                      item => (
                        <List.Item><Checkbox style={{marginLeft:'25px'}} value={JSON.stringify(item)}>{item.name}</Checkbox></List.Item>
                    )}
                  />
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div className={styles.tabsetitem}>
                  <List
                    header={<div className={styles.tabsettitle}>明细</div>}
                    dataSource={data2}
                    renderItem={
                      item => (
                        <List.Item><Checkbox style={{marginLeft:'25px'}} value={JSON.stringify(item)}>{item.name}</Checkbox></List.Item>
                      )}
                  />
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div className={styles.tabsetitem}>
                  <List
                    header={<div className={styles.tabsettitle}>管理</div>}
                    dataSource={data3}
                    renderItem={
                      item => (
                        <List.Item><Checkbox style={{marginLeft:'25px'}} value={JSON.stringify(item)}>{item.name}</Checkbox></List.Item>
                    )}
                  />
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div className={styles.tabsetitem}>
                  <List
                    header={<div className={styles.tabsettitle}>其他</div>}
                    // bordered
                    dataSource={data4}
                    renderItem={
                      item => (
                        <List.Item><Checkbox style={{marginLeft:'25px'}} value={JSON.stringify(item)}>{item.name}</Checkbox></List.Item>
                    )}
                  />
                </div>
              </Col>
            </Checkbox.Group>
          </div>
        </Row>
      </div>
      );
  }
}

export default AllUsed
