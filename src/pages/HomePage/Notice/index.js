import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Icon,
  List,
  Modal,
  Divider,
} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../Guide.less';
import commonStyle from '../../../global.less'; // 公共样式

const Details = (props => {
  const {
    visible,
    handleOk,
    handleCancel,
    noticeDetail,
  } = props;
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
  );
})

@connect(({ store }) => ({
  store,
}))
class Notice extends Component {
  constructor(props){
    super(props)
    this.state={
      visible:false,
      noticeDetail:{},
    }
  }

  show = (id) => {
    const { dispatch } = this.props;
    if (!id) {
      dispatch(routerRedux.push('/storeManagement/bulletinManagement'));
      return;
    }
    this.setState({
      visible:true
    })
    dispatch({
      type:'store/bulletinDetails',
      payload:{id},
      callback:(res)=>{
        this.setState({
          noticeDetail:res.data
        })
      }
    })

  }

  handleOk=()=>{
    this.setState({
      visible:false
    })
  }

  handleCancel=()=>{
    this.setState({
      visible:false
    })
  }

  render() {
    const {
      notice
    } = this.props;

    const detailsProps ={
      visible:this.state.visible,
      handleOk:this.handleOk,
      handleCancel:this.handleCancel,
      noticeDetail:this.state.noticeDetail,
    }

    return (
      <div className={commonStyle["rowBackground-div"]}>
        <List
          header={<div><span className={styles.title}><Icon type="pushpin" theme="twoTone" style={{float:'right',fontSize:22}} />公告</span></div>}
          dataSource={notice}
          renderItem={item => (<List.Item onClick={()=>this.show(item.id)} style={{ cursor: 'pointer'}}>{item.title}</List.Item>)}
        />
        <Details {...detailsProps} />
      </div>
    );
  }
}

export default Notice
