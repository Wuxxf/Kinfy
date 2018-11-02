import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Button,
  Table,
  Input,
  Divider,
  Modal,
  Form,
  Card,
  message,
  Popconfirm,
} from 'antd';
import Statistics from '@/components/Statistics';
import SupplierAdd from '@/components/SupplierAdd';
import ColumnConfig from '@/components/ColumnConfig';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import commonStyle from '../../global.less'; // 公共样式
import styles from './SupplierManagement.less';

const FormItem = Form.Item;

// 本地存储 统计数据是否显示
if (localStorage.getItem('switchLoding') === null) {
  localStorage.setItem('switchLoding', 0);
}

// Table表头
const supplierColumns = [
  {
    title: '供应商名称',
    defaultTitile:'供应商名称', // 默认名
    visible: true, // 是否显示
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '应付款',
    defaultTitile:'应付款', // 默认名
    visible: true, // 是否显示
    dataIndex: 'pay',
    key: 'pay',
  }, {
    title: '联系人',
    defaultTitile:'联系人', // 默认名
    visible: true, // 是否显示
    dataIndex: 'contacts',
    key: 'contacts',
  }, {
    title: '手机号码',
    defaultTitile:'手机号码', // 默认名
    visible: true, // 是否显示
    dataIndex: 'mobile_phone',
    key: 'mobile_phone',
  }, {
    title: '创建时间',
    defaultTitile:'创建时间', // 默认名
    visible: true, // 是否显示
    dataIndex: 'created_at',
    key: 'created_at',
  }, {
    title: '地址',
    defaultTitile:'地址', // 默认名
    visible: true, // 是否显示
    dataIndex: 'address',
    key: 'address',
  }, {
    title: '备注',
    defaultTitile:'备注', // 默认名
    visible: true, // 是否显示
    dataIndex: 'remarks',
    key: 'remarks',
  },
];
if (!JSON.parse(localStorage.getItem('supplierColumns')))
  localStorage.setItem('supplierColumns',JSON.stringify(supplierColumns));

// 更新供应商组件
const UpdateSupplier = Form.create()(props => {
  const {
    form,
    updateData, // 选中更新的供应商数据
    updateCancel,
    updatevisible,
    handleUpdate, // 更新请求
  } = props;

  const updatehandleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      handleUpdate(fieldsValue);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="修改供应商信息"
      destroyOnClose={true}
      visible={updatevisible}
      onOk={updatehandleOk}
      onCancel={updateCancel}
      okText="保存"
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商名称">
        {form.getFieldDecorator('name', {
          rules: [
            { required: true, message: '请输入供应商名称' },
            { whitespace: true, message: '供应商名称不能为空' },
          ],
          initialValue: updateData.name,
        })(<Input placeholder="请输入供应商名称" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="应付欠款">
        {form.getFieldDecorator('pay', {
          rules: [
            {
              pattern: /^[0-9]+(.[0-9]{1,2})?$/,
              message: '请输入正确金额',
            },
          ],
          initialValue: updateData.pay,
        })(<Input placeholder="请输入应付欠款" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="联系人">
        {form.getFieldDecorator('contacts', {
          rules: [
            { required: true, message: '请输入联系人' },
            { whitespace: true, message: '供应商名称不能为空' },
          ],
          initialValue: updateData.contacts,
        })(<Input placeholder="请输入联系人" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="联系电话">
        {form.getFieldDecorator('mobile_phone', {
          rules: [
            { required: true, message: '请设置联系电话' },
            {
              pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
              message: '请输入正确的手机号码！',
            },
          ],
          initialValue: updateData.mobile_phone,
        })(<Input placeholder="请设置门店电话" maxLength={11} />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商地址">
        {form.getFieldDecorator('address', {
          initialValue: updateData.address,
        })(<Input placeholder="请输入供应商地址" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="供应商备注">
        {form.getFieldDecorator('remarks', {
          initialValue: updateData.remarks,
        })(<Input placeholder="请输入供应商备注" />)}
      </FormItem>
    </Modal>
  );
});

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
      isAllData: true, // 是否为全部数据
      supplierData: [], // 初始化供应商数据
      searchText: '', // 搜索供应商名称Value
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

  // 搜索框
  onInputChange = e => {
    this.setState({
      searchText: e.target.value,
    });
  };

  // 条件搜索
  onSearch = () => {
    const { dispatch } = this.props;
    const { isAllData } = this.state; 
    const { searchText } = this.state;
    dispatch({
      type: 'supplier/supplierinf',
      payload: {
        page: 1,
        name: searchText,
      },
    });
    if (!isAllData) {
      this.setState({
        isAllData: true,
      });
    }
  };

  // 重置
  onReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchText: '',
    });
    dispatch({
      type: 'supplier/supplierinf',
      payload: {
        page: 1,
        name: '',
      },
    });
  };

  // 隐藏或显示供应商零欠款
  setAllData = () => {
    const { dispatch } = this.props;
    const { isAllData } = this.state;
    // 控制按钮文字
    this.setState(
      prevState => ({
        isAllData: !prevState.isAllData,
      }),
      () => {
        dispatch({
          type: 'supplier/supplierinf',
          payload: {
            page: 1,
            arrears: Number(isAllData),
          },
        });
        this.setState({
          current: 1,
        });
      }
    );
  };

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
      switchLoding: !checked,
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
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.delSupplier(record)}>
              <a style={{ color: '#FF4500' }}>删除</a>
            </Popconfirm>
          </span>
        );
      },
    })  
    return columns;
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
      display,
      searchText,
      isAllData,
    } = this.state;
    const { loading , dispatch} = this.props;

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
        <Card className={commonStyle.rowBackground} style={display}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col sm={24} md={8}>
              <Input
                style={{ marginTop: 5 }}
                addonBefore="供应商名称"
                placeholder="搜索供应商名称"
                value={searchText}
                onChange={this.onInputChange}
                onPressEnter={this.onSearch}
              />
            </Col>
            <Col sm={24} md={14} className={styles.buttonGroup}>
              <Button type="primary" onClick={this.onSearch} style={{ marginRight: 8 }}>
                搜索
              </Button>
              <Button type="primary" onClick={this.onReset} style={{ marginRight: 8 }}>
                重置
              </Button>
              <Button onClick={this.setAllData}>
                {isAllData ? '隐藏零欠款供应商' : '显示全部供应商'}
              </Button>
            </Col>
          </Row>
        </Card>
        <Card className={commonStyle.rowBackground} style={display}>
          <Statistics {...StatisticsMethods} />
        </Card>
        <Card className={commonStyle.rowBackground}>
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
              onChange: page => {
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
              },
            }}
          />
        </Card>
        <UpdateSupplier {...updateSupplierMethods} updatevisible={updatevisible} />
      </PageHeaderWrapper>
    );
  }
}

export default supplierManagement;