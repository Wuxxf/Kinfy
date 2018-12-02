import React, { Component } from 'react';
import {
  Badge,
  Divider,
  Modal,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

class StoreDetails extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  render() {
    const { initialValue ,visible,onCancel} = this.props ;
    let industryName= '';
    let userName='';
    let operationMode = '零售';
    if(initialValue.industry){
      industryName = initialValue.industry.name
    }
    if(initialValue.user){
      userName = initialValue.user.name
    }
    if(initialValue.operation_mode===2){
      operationMode = '批发';
    }else if(initialValue.operation_mode===3){
      operationMode = '零售兼批发';
    }

    return (
      <Modal
        title='门店详情'
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={1000}
      >
        <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
          <Description term="门店编号">{initialValue.store_no}</Description>
          <Description term="门店名称">{initialValue.name}</Description>
          <Description term="创建人">{userName}</Description>
          <Description term="门店电话">{initialValue.mobile_phone}</Description>
          <Description term="创建门店时间">{initialValue.created_at}</Description>
          <Description term="状态">
            {
            initialValue.state===1
            ?<Badge status="success" text="正常营业" />
            :<Badge status="error" text="停止营业" />
            }
          </Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" style={{ marginBottom: 32 }}>
          <Description term="货品库存"><div>{initialValue.all_goods}</div></Description>
          <Description term="货品数量"><div>{initialValue.use_goods}</div></Description>
          <Description term="客户数量"><div>{initialValue.num_customer}</div></Description>
          <Description term="当前员工数"><div>{initialValue.now_staff}</div></Description>
          <Description term="最大员工数"><div>{initialValue.max_staff}</div></Description>
          <Description term="供应商数量"><div>{initialValue.num_supplier}</div></Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" style={{ marginBottom: 32 }}>
          {/* <Description term="开始营业时间">{initialValue.open_time}</Description>
          <Description term="结束营业时间">{initialValue.close_time}</Description> */}
          <Description term="所属行业"><div>{industryName}</div></Description>
          <Description term="经营方式"><div>{operationMode}</div></Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
      </Modal>
    );
  }
}

export default StoreDetails
