import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Table,
  Divider,
  Form,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Statistics from '@/components/Statistics';
import SupplierAdd from '@/components/SupplierAdd';
import ColumnConfig from '@/components/ColumnConfig';
import Search from './Search';
import UpdateSupplier from './Update'
import supplierColumns from './columns';

import commonStyle from '../../global.less'; // 公共样式


// 本地存储 统计数据是否显示
if (localStorage.getItem('switchLoding') === null) {
  localStorage.setItem('switchLoding', 0);
}

if (!JSON.parse(localStorage.getItem('supplierColumns')))
  localStorage.setItem('supplierColumns',JSON.stringify(supplierColumns));


@connect(({ supplier, loading }) => ({
  supplier,
  loading: loading.models.supplier,
}))
@Form.create()
class supplierManagement extends Component {
  constructor(props) {
    super(props);

    let getColumns = JSON.parse(localStorage.getItem('supplierColumns'));
    if(getColumns.length !== supplierColumns.length){
        getColumns = supplierColumns;
    }

    this.state = {
      current: 1, // 当前页数
      updatevisible: false, // 更新供应商组件显隐
      supplierData: [], // 初始化供应商数据
      updateData: {}, // 所更新的数据
      switchLoding: !Number(localStorage.getItem('switchLoding')), // 控制统计组件数据显隐
      getColumns,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { current } = this.state;
    dispatch({
      type: 'supplier/supplierinf',
      payload: {
        page: current,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { supplier } = this.props;
    if (nextProps.supplier !== supplier) {
      const tableDate = nextProps.supplier.supplierData;

      const tableDateLength = tableDate.length;

      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.supplier.supplierFrom + i;
      }

      this.setState({
        supplierData: tableDate, // 供应商数据源
        supplierTotal: nextProps.supplier.supplierTotal, // 供应商个数
        payTotal: nextProps.supplier.payTotal, // 应付欠款
      });
    }
  }


  // 条件搜索
  onSearch = (value) => {
    const { dispatch } = this.props;
    const payload = {
      page:1,
      ...value,
      'arrears': Number(value.arrears),
    }

    dispatch({
      type: 'supplier/supplierinf',
      payload,
    });

  };

  // 重置
  onReset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/supplierinf',
      payload: {
        page: 1,
      },
    });
  }


  // 删除供应商(请求)
  delSupplier = record => {
    const { dispatch } = this.props;
    const { supplierData , current } = this.state;
    const supplierLength = supplierData.length;

    dispatch({
      type: 'supplier/del',
      payload: {id: record.id},
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          if (supplierLength === 1)
            dispatch({
              type: 'supplier/supplierinf',
              payload: {
                page: current - 1,
                name: '',
              },
            });
          dispatch({
            type: 'supplier/supplierinf',
            payload: {
              page: current,
              name: '',
            },
          });
        }
      },
    });
  };

  // 添加供应商callback
  supplierAdd = () => {
    const { current } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/supplierinf',
      payload: {
        page: current,
      },
    });
  };

  // 修改供应商
  updateSupplier = record => {
    this.setState({
      updatevisible: true,
      updateData: record,
    });
  };

  // 修改供应商返回
  updateCancel = () => {
    this.setState({
      updatevisible: false,
    });
  };

  // 编辑供应商请求
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { updateData , current } = this.state;
    fields.id = updateData.id;

    this.setState(
      {
        updatevisible: false,
      },
      () => {
        dispatch({
          type: 'supplier/update',
          payload: fields,
          callback: res => {
            if (res.errcode) {
              message.error(res.msg);
              this.setState({
                updatevisible: true,
              });
            } else {
              message.success(res.msg);
              dispatch({
                type: 'supplier/supplierinf',
                payload: {
                  page: current,
                },
              });
            }
          },
        });
      }
    );
  };

   // 列配置返回
   newColumn = (data) => {
    localStorage.setItem('supplierColumns', JSON.stringify(data));
    const getColumns = JSON.parse(localStorage.getItem('supplierColumns'))
    this.setState({
      getColumns,
    })
  }

  // 统计开关
  switchange = checked => {
    this.setState({
      switchLoding: checked,
    });
    if (checked) {
      localStorage.setItem('switchLoding', 1);
    } else {
      localStorage.setItem('switchLoding', 0);
    }
  };

  columns = (columns) =>{
    const { getColumns } = this.state;
    columns.unshift({
      title: (<ColumnConfig minCol={4} columns={getColumns} defaultColumns={supplierColumns} callback={this.newColumn} />),
      dataIndex: 'index',
      key: 'index',
      align: 'center',
    })
    columns.push({
      title: '操作',
      key: 'operation',
      width:235,
      render: record => {
        return (
          <span>
            <Link to={{pathname: '/openbill/purchasepayment',state: {name: record.name,id: record.id}}} style={{ color: '#1890ff' }}>
              付款
            </Link>
            <Divider type="vertical" />
            <Link
              to={{
                pathname: '/purchaseDetail/shippingOrder',
                state: {
                  name: record.name,
                },
              }}
              style={{ color: '#1890ff' }}
            >
              进货单
            </Link>
            <Divider type="vertical" />
            <a onClick={() => this.updateSupplier(record)} style={{ color: '#FFC125' }}>
              修改
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此供应商？" onConfirm={() => this.delSupplier(record)}>
              <a style={{ color: '#FF4500' }}>删除</a>
            </Popconfirm>
          </span>
        );
      },
    })
    return columns;
  }

  pageOnChange = page => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/supplierinf',
      payload: {
        page,
      },
      callback: () => {
        this.setState({
          current: page,
        });
      },
    });
  }

  render() {
    const {
      supplierTotal,
      supplierData,
      updatevisible,
      updateData,
      switchLoding,
      payTotal,
      getColumns,
      current,
    } = this.state;
    const { loading } = this.props;

    const StatisticsMethods = {
      dataSource:[{title:'供应商数',total:supplierTotal,units:''},{title:'欠供应商款',total:payTotal,units:'元'}],
      switchLoding,  //  boolean state
      switchange: this.switchange,    //  function  开关改变
    };

    const updateSupplierMethods = {
      updateData,
      updateCancel: this.updateCancel,
      handleUpdate: this.handleUpdate,
    };

    const columns = [];

    for (let i = 0; i < getColumns.length; i++) {
      if(getColumns[i].visible){
        columns.push(getColumns[i])
      }
    }
    this.columns(columns)

    return (
      <PageHeaderWrapper
        title="供应商信息"
        action={<SupplierAdd callpackParent={() => this.supplierAdd()} />}
      >
        <div className={commonStyle['rowBackground-div']}>
          <Search callback={this.onSearch} reset={this.onReset} />
        </div>
        <div className={commonStyle['rowBackground-div']}>
          <Statistics {...StatisticsMethods} />
        </div>
        <div className={commonStyle['rowBackground-div']}>
          <Table
            className={commonStyle.tableAdaption}
            columns={columns}
            dataSource={supplierData}
            rowKey={record => record.id}
            loading={loading}
            locale={{ emptyText: '暂无供应商' }}
            bordered={true}
            onChange={this.handleChange}
            pagination={{
              current,
              total: supplierTotal,
              defaultPageSize: 10,
              onChange: this.pageOnChange,
            }}
          />
        </div>
        <UpdateSupplier {...updateSupplierMethods} updatevisible={updatevisible} />
      </PageHeaderWrapper>
    );
  }
}

export default supplierManagement;
