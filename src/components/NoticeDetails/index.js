import React, { Component } from 'react';
import {
  Modal,
  Divider,
} from 'antd';

import styles from './index.less'

class NoticeDetails extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  render() {
    const {
      visible,
      handleOk,
      handleCancel,
      noticeDetail,
    } = this.props;
    return (
      <Modal
        title="公告详情"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h2>标题：{noticeDetail.title}</h2>{noticeDetail.created_at}<Divider />
        <div className={styles['notice-content']} dangerouslySetInnerHTML={{ __html:noticeDetail.content }} />
      </Modal>
    )
  }
}

export default NoticeDetails
