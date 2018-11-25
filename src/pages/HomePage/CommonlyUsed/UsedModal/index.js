import React, { Component } from 'react';
import {
  Col,
  Row,
  Modal,
  Divider,
} from 'antd';

import AllUsed from './AllUsed';
import SelectedUsed from './SelectedUsed';



class UsedModal extends Component {
  constructor(props){
    super(props)

    this.state={
      selectedUsed:[],
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedUsed !== this.props.selectedUsed){
      this.setState({
        selectedUsed:nextProps.selectedUsed
      })
    }

  }

  newSelected = (selectedUsed) =>{
    this.setState({
      selectedUsed,
    })
  }

  cancel = () =>{
    this.setState({
      selectedUsed:this.props.selectedUsed,
    })
    this.props.handleCancel()
  }

  render() {
    const { selectedUsed } =  this.state;
    const {
      visible,
      handleOk,
    } = this.props;
    return (
      <Modal
        title="常用功能"
        visible={visible}
        onOk={()=>handleOk(selectedUsed)}
        style={{ top: 20 }}
        width={725}
        okText='保存'
        destroyOnClose
        onCancel={this.cancel}
      >
        <Row>
          <Col span={24}>已选择：<br /><br /></Col>
          <Col span={24}><SelectedUsed callback={(e)=>this.newSelected(e)} key='SelectedUsed' selectedUsed={selectedUsed} /></Col>
          <Divider />
          <Col span={24}>功能列表：<br /><br /></Col>
          <Col span={24}>
            <AllUsed key='AllUsed' callback={(e)=>this.newSelected(e)} selectedUsed={selectedUsed} />
          </Col>

        </Row>
      </Modal>
    );
  }
}

export default UsedModal
