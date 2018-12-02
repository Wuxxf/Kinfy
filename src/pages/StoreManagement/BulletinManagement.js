import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Badge, Button, Divider } from 'antd';
import BulletinAdd from '@/components/BulletinAdd';
import NoticeDetails from '@/components/NoticeDetails';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import commonStyle from '../../global.less'; // 公共样式


const statusMap = ['error', 'success'];
const status = ['未读', '已读'];

@connect(({ store ,loading}) => ({
  store,
  loading:loading.effects['store/systemBulletin']
}))
class BulletinManagement extends Component {
  state = {
    detailsVisible: false,
    noticeDetail:{},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/systemBulletin',
    });
  }

  // 点击确定
  handleOk = () => {
    this.setState({
      detailsVisible: false,
    });
  };




  showAdd = () =>{
    this.setState({
      addBulletin:true,
    })
  }

  cloesAdd = () =>{
    this.setState({
      addBulletin:false,
    })
  }

  fetchBulletin = (values) =>{

    console.log(values) // eslint-disable-line
    this.setState({
      addBulletin:false,
    })
  }

  notRead = (record) =>{
    const { notice } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'store/isread',
      payload:{
        id:notice.id,
        is_read:0,
      },
      callback:()=>{
        dispatch({
          type: 'store/systemBulletin',
        });
      }
    })
  }


  show = (id) => {
    const { dispatch } = this.props;
    this.setState({
      detailsVisible:true
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
      detailsVisible:false
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'store/systemBulletin',
    });

  }

  handleCancel=()=>{
    this.setState({
      detailsVisible:false
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'store/systemBulletin',
    });
  }

  render() {
    const { store, loading } = this.props;
    const { detailsVisible  , addBulletin } = this.state;
    const { systemBulletinData } = store;

    // 公告columns
    const SystemBulletinColumns = [
      {
        title: '公告类型',
        dataIndex: 'notice_type',
        key: 'notice_type',
      },
      {
        title: '公告主题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '是否已读',
        dataIndex: 'notice.is_read',
        key: 'notice.is_read',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.is_read.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '发布时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: '操作',
        key: 'operation',
        render: record => (
          <span>
            <a onClick={() => this.show(record.id)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => this.notRead(record)}>标记成未读</a>
          </span>
        ),
      },
    ];

    const detailsProps ={
      visible:detailsVisible,
      handleOk:this.handleOk,
      handleCancel:this.handleCancel,
      noticeDetail:this.state.noticeDetail,
    }

    return (
      <PageHeaderWrapper
        title="公告管理"
        action={
          <Button type="primary" onClick={this.showAdd}>发布公告</Button>
        }
      >
        <div className={commonStyle['rowBackground-div']}>
          <Table
            columns={SystemBulletinColumns}
            dataSource={systemBulletinData}
            loading={loading}
            pagination={false}
            bordered
            locale={{ emptyText: '暂无公告' }}
            rowKey={record => record.id}
          />
          <NoticeDetails {...detailsProps} />
          <BulletinAdd visible={addBulletin} onCancel={this.cloesAdd} onOk={this.fetchBulletin} />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default BulletinManagement
