import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Table, Badge, Modal, Button, Divider ,Card } from 'antd';
import BulletinAdd from '@/components/BulletinAdd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import commonStyle from '../../global.less'; // 公共样式

const { TabPane } = Tabs;
const statusMap = ['error', 'success'];
const status = ['未读', '已读'];



@connect(({ store }) => ({
  store,
}))
class BulletinManagement extends Component {
  state = {
    detailsVisible: false,
    detailscontent: '',
    tabsKey:1,
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

  // 详情
  details = (e, record) => {
    const { dispatch } = this.props;
    const rowData = record;
    dispatch({
      type: 'store/isread',
      payload: {
        id: record.id,
        is_read: 1,
      },
      callback: () => {
        rowData.is_read = 1;
        this.setState({
          detailsVisible: true,
          detailscontent: record.systemnotice.content,
        });
      },
    });
  };

  // 标记成未读
  notRead = (e, record) => {
    const { dispatch } = this.props;
    const rowData = record;

    const bulletinId = record.id;
    dispatch({
      type: 'store/isread',
      payload: {
        id: bulletinId,
        is_read: 0,
      },
      callback: () => {
        rowData.is_read = 0;
      },
    });
  };

  tabsOnchange = e => {
    this.setState({
      tabsKey:Number(e),
    })
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

  render() {
    const { store, loading } = this.props;
    const { detailsVisible , tabsKey , addBulletin , detailscontent} = this.state;
    const { systemBulletinData } = store;

    // 系统公告columns
    const SystemBulletinColumns = [
      {
        title: '公告类型',
        dataIndex: 'systemnotice.notice_type',
        key: 'systemnotice.notice_type',
      },
      {
        title: '公告主题',
        dataIndex: 'systemnotice.title',
        key: 'systemnotice.title',
      },
      {
        title: '是否已读',
        dataIndex: 'is_read',
        key: 'is_read',
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
            <a onClick={e => this.details(e, record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={e => this.notRead(e, record)}>标记成未读</a>
          </span>
        ),
      },
    ];

    // 门店公告columns
    const StoreBulletinColumns = [
      {
        title: '公告主题',
        dataIndex: 'storenotice.title',
        key: 'storenotice.title',
      },
      {
        title: '是否已读',
        dataIndex: 'is_read',
        key: 'is_read',
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
        title: '发布人',
        dataIndex: 'user.name',
        key: 'user.name',
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
            <a onClick={e => this.details(e, record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={e => this.notRead(e, record)}>标记成未读</a>
          </span>
        ),
      },
    ];

    const tabsProps = {
      defaultActiveKey: '1',
      tabBarExtraContent: tabsKey===1?<Button onClick={this.showAdd}>发布公告</Button>:null,
    }

    return (
      <PageHeaderWrapper title="公告管理">
        <Card className={commonStyle.rowBackground}>
          <Tabs {...tabsProps} onChange={this.tabsOnchange}>
            <TabPane tab="门店公告" key="1">
              <Table
                columns={StoreBulletinColumns}
                dataSource={[]}
                loading={loading}
                pagination={false}
                bordered
                locale={{ emptyText: '暂无公告' }}
                // rowKey={record => record.id}
              />
            </TabPane>
            <TabPane tab="系统公告" key="2">
              <Table
                columns={SystemBulletinColumns}
                dataSource={systemBulletinData}
                loading={loading}
                pagination={false}
                bordered
                locale={{ emptyText: '暂无公告' }}
                rowKey={record => record.id}
              />
            </TabPane>
          </Tabs>
          <Modal
            title="公告详情"
            visible={detailsVisible}
            onOk={this.handleOk}
            onCancel={this.handleOk}
          >
            <div dangerouslySetInnerHTML={{ __html: detailscontent }} />
          </Modal>
          <BulletinAdd visible={addBulletin} onCancel={this.cloesAdd} onOk={this.fetchBulletin} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BulletinManagement