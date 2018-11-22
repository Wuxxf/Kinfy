import React, { Component } from 'react';
import {
  Col,
  Row,
  Modal,
} from 'antd';

import AllUsed from './AllUsed';
import SelectedUsed from './SelectedUsed';
import MyIcon from '@/components/MyIcon';


class UsedModal extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  render() {
    const {
      visible,
      handleOk,
      handleCancel
    } = this.props;

    return (
      <Modal
        title="常用功能"
        visible={visible}
        onOk={handleOk}
        okText='保存'
        onCancel={handleCancel}
      >
        <Row>
          {/* 利用数组去重？ */}
          <Col span={24}>已选择：<AllUsed /></Col>
          <Col span={24}>功能列表：</Col>
          <Col xs={8} sm={3} md={3} lg={4} xl={12} style={{textAlign:'center',cursor: 'pointer'}}>
            <SelectedUsed />
            <MyIcon type="icon-zhuanxiangfeiyusuan" style={{fontSize:56}} />
            <div>销售还款</div>
            <br />
          </Col>

        </Row>
      </Modal>
    );
  }
}

export default UsedModal
