import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Table,
  Badge,
  Button,
  Divider,
  Modal,
  Form,
  message,
  Popconfirm,
} from 'antd';
import StoreModal from '@/components/StoreModal';
import ColumnConfig from '@/components/ColumnConfig';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StoreDetails from './StoreDetails';

import commonStyle from '../../global.less'; // 公共样式

const { confirm } = Modal;

const statusMap = ['error', 'success'];
const status = ['停止营业', '正常营业'];

// colums
const storeColumns = [
    {
      title: '门店名称',
      defaultTitile:'门店名称', // 默认名
      visible: true, // 是否显示
      dataIndex: 'name',
      key: 'name',

    },
    {
      title: '编号',
      dataIndex: 'store_no',
      key: 'store_no',
      defaultTitile:'编号', // 默认名
      visible: true, // 是否显示
    },
    {
      title: '门店logo',
      dataIndex: 'img_path',
      key: 'img_path',
      width:64,
      defaultTitile:'门店logo', // 默认名
      visible: true, // 是否显示
    },
    {
      title: '所属行业',
      dataIndex: 'industry.name',
      key: 'industry.name',
      defaultTitile:'所属行业', // 默认名
      visible: true, // 是否显示
    },
    {
      title: '经营方式',
      dataIndex: 'operation_mode',
      key: 'operation_mode',
      defaultTitile:'经营方式', // 默认名
      visible: true, // 是否显示
    },
    {
      title: '创建人',
      dataIndex: 'user.name',
      key: 'user.name',
      defaultTitile:'创建人', // 默认名
      visible: true, // 是否显示
    },
    {
      title: '电话',
      dataIndex: 'mobile_phone',
      key: 'mobile_phone',
      defaultTitile:'电话', // 默认名
      visible: true, // 是否显示
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      defaultTitile:'创建时间', // 默认名
      visible: true, // 是否显示
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      defaultTitile:'状态', // 默认名
      visible: true, // 是否显示
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
    },
];

if (!JSON.parse(localStorage.getItem('storeColumn')))
  localStorage.setItem('storeColumn',JSON.stringify(storeColumns));

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
class StoreInformation extends Component {
  constructor(props) {
    super(props);

    let getColumns = JSON.parse(localStorage.getItem('storeColumn'));
    if(getColumns.length !== storeColumns.length){
        getColumns = storeColumns;
    }

    this.state = {
      industryData: [], // 初始化行业
      storeData: [], // 初始化门店
      initialValue:{},
      getColumns,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/storeind',
    });
    dispatch({
      type: 'store/fetchStoreInfo',
    });

  }

  componentWillReceiveProps(nextProps) {
    const { store } = this.props;
    if (nextProps.store !== store) {
      const tableDate = nextProps.store.dataSource;

      const tableDateLength = tableDate.length;

      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = 1 + i;
      }
      this.setState({
        industryData: nextProps.store.IndustryData,
        storeData: tableDate,
      });
    }

  }

  // 编辑门店
  toggleEditable = record => {
    this.recordStore(record.id)
    this.setState({
      updateModalVisible:true,
    })
  };

  // 编辑门店隐藏
  updateModal = () => {
    this.setState({
      updateModalVisible: false,
    });
  };

  // 编辑门店请求
  handleUpdateModal = fields => {
    const { dispatch } = this.props;
    this.setState({ updateModalVisible: false }, () =>
      dispatch({
        type: 'store/update',
        payload:fields ,
        callback: res => {
          if (res.errcode) {
            message.error(res.msg);
            this.setState({
              updateModalVisible: true,
            });
          } else {
            message.success(res.msg);
            dispatch({
              type: 'store/fetchStoreInfo',
            });
          }
        },
      })
    );
  };

  // 添加门店Modal 显示隐藏
  addStore = flag => {
    this.setState({
      addModalVisible: !!flag,
    });
  }

  // 删除选中的store
  del = record => {
    const { dispatch } = this.props;

    confirm({
      title: '此操作不可逆！是否删除',
      iconType:'warning',
      onOk() {
        dispatch({
          type: 'store/del',
          payload: {
            id: record.id,
          },
          callback: res => {
            if (res.errcode) {
              message.error(res.msg);
            } else {
              message.success(res.msg);
              dispatch({
                type: 'store/fetchStoreInfo',
              });
            }
          },
        });
      },
    });
  }

  // 添加门店请求
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/add',
      payload: fields,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          dispatch({
            type: 'store/fetchStoreInfo',
          });
          this.setState({
            addModalVisible: false,
          });
        }
      },
    });
  }

  // 列配置返回
  newColumn = (data) => {
    localStorage.setItem('storeColumn', JSON.stringify(data));
    const getColumns = JSON.parse(localStorage.getItem('storeColumn'))
    this.setState({getColumns})
  }

  // show 门店详情
  showDetails = (record) => {
    this.recordStore(record.id)
    this.setState({
      detailsVisible:true,
    })
  };

  // record 门店
  recordStore = (id) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'store/fetchStoreDetails',
      payload:{ id },
      callback:(res)=>{
        if(res.errcode){
          message.error('出错了！稍后再试')
        }else{
          this.setState({
            initialValue:res.data,
          })
        }
      },
    });
  }

  // 关闭详情
  closeDetails = () =>{
    this.setState({
      detailsVisible:false,
    })
  }

  columns = (columns) =>{
    const newColumns = columns;
    const { getColumns , storeData } =  this.state;
    newColumns.unshift({
      title: (<ColumnConfig minCol={4} columns={getColumns} defaultColumns={storeColumns} callback={this.newColumn} />),
      dataIndex: 'index',
      key: 'index',
      align: 'center',
    })
    newColumns.push({
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      width:160,
      render: (text,record) => {
          if(storeData.length === 1){
            return (
              <span>
                <a onClick={() => this.showDetails(record)}>详情</a>
                <Divider type="vertical" />
                <a style={{color:'#faad14'}} onClick={() => this.toggleEditable(record)}>修改</a>
                <Divider type="vertical" />
                <span style={{color:'#c4c4c4',cursor: 'no-drop'}}>删除</span>
              </span>
            );
          }else{
            return (
              <span>
                <a onClick={() => this.showDetails(record)}>详情</a>
                <Divider type="vertical" />
                <a style={{color:'#faad14'}} onClick={() => this.toggleEditable(record)}>修改</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此商店？" onConfirm={() => this.del(record)}>
                  <a style={{color:'#f5222d'}}>删除</a>
                </Popconfirm>
              </span>
          );
        }
      },
    })
    // 给列加上render等
    for (let i = 0; i < newColumns.length; i+=1) {
      if (newColumns[i].dataIndex === 'state') {
        newColumns[i].onFilter = (value, record) => record.state.toString() === value
        newColumns[i].render = (val) => {
          return <Badge status={statusMap[val]} text={status[val]} />;
        }
      }
      if(newColumns[i].dataIndex === 'operation_mode'){
        newColumns[i].render = (record) => {
          if(record===1)  return '零售';
          else if(record === 2) return '批发';
          else if(record === 3) return '零售兼批发';
        }
      }
      if(newColumns[i].dataIndex === 'img_path'){
        newColumns[i].render = (record) => {
          return (!record?<span />:<img src={record} style={{ width: '64px' }} alt='logo' />)
        }
      }
    }
    return columns;
  }

  render() {
    const { addModalVisible,detailsVisible, industryData,initialValue, storeData, updateModalVisible,getColumns } = this.state;
    const { loading } = this.props;

    const addParentMethods = {
      visible:addModalVisible,
      title:'添加门店',
      onOk: this.handleAdd,
      onCancel: this.addStore,
      industryData ,
    };

    const updateParentMethods = {
      visible:updateModalVisible,
      title:'修改门店',
      initialValue, // 默认值
      onOk: this.handleUpdateModal,
      onCancel: this.updateModal,
      industryData,
      destroyOnClose:true,
    };

    const columns = [];

    for (let i = 0; i < getColumns.length; i+=1) {
      if(getColumns[i].visible){
        columns.push(getColumns[i])
      }
    }
    this.columns(columns)

    return (
      <PageHeaderWrapper
        title="门店信息"
        action={<Button type="primary" onClick={() => this.addStore(true)}>添加门店</Button>}
      >
        <div className={commonStyle['rowBackground-div']}>
          <Table
            className={commonStyle.tableAdaption}
            dataSource={storeData}
            columns={columns}
            loading={loading}
            bordered={true}
            pagination={false}
            rowKey={record => record.id}
          />
        </div>
        <StoreDetails visible={detailsVisible} onCancel={this.closeDetails} initialValue={initialValue} />
        <StoreModal {...addParentMethods}   />
        <StoreModal {...updateParentMethods}  />
      </PageHeaderWrapper>
    );
  }
}

export default StoreInformation;
