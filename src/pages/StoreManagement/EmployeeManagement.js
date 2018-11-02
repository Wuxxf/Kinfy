import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Table,
  Badge,
  Button,
  Divider,
  message,
  Popconfirm,
  Form,
  Modal,
  Popover,
  Input,
  Progress,
  Card,
} from 'antd';
import ColumnConfig from '@/components/ColumnConfig';
import EmployeeModal from '@/components/EmployeeModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import commonStyle from '../../global.less'; // 公共样式
import styles from './index.less';





const FormItem = Form.Item;
const employeeColumns = [
  {
    title: '员工头像',
    defaultTitile:'员工头像', // 默认名
    visible: true, // 是否显示,
    dataIndex: 'avatar',
    key: 'avatar',
    width:64,
  },
  {
    title: '员工名称',
    defaultTitile:'员工名称', // 默认名
    visible: true, // 是否显示,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '手机号码',
    defaultTitile:'手机号码', // 默认名
    visible: true, // 是否显示,
    dataIndex: 'mobile_phone',
    key: 'mobile_phone',
  },
  {
    title: '员工权限',
    defaultTitile:'员工权限', // 默认名
    visible: true, // 是否显示,
    dataIndex: 'role.name',
    key: 'role.name',
  },
  {
    title: '可否登录',
    defaultTitile:'可否登录', // 默认名
    visible: true, // 是否显示,
    dataIndex: 'is_login',
    key: 'is_login',
  },
  {
    title: '是否在职',
    defaultTitile:'是否在职', // 默认名
    visible: true, // 是否显示,
    dataIndex: 'state',
    key: 'state',
   
  },
  {
    title: '邮箱地址',
    defaultTitile:'邮箱地址', // 默认名
    visible: true, // 是否显示,
    dataIndex: 'email',
    key: 'email',
  },
];
if (!JSON.parse(localStorage.getItem('employeeColumns')))
    localStorage.setItem('employeeColumns',JSON.stringify(employeeColumns));

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};
    
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};    

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
class EmployeeManagement extends Component {
  constructor(props) {
    super(props);

    let getColumns = JSON.parse(localStorage.getItem('employeeColumns'));
    if(getColumns.length !== employeeColumns.length){
        getColumns = employeeColumns;
    }

    this.state = {
      getColumns,
      modalVisible: false, // 添加员工modal
      updatevisible: false, // 编辑员工modal
      initialValue: {}, // 编辑员工默认数据
      employeeData: [],
      help:'',
    };
  }
  

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/fetchEmployee',
    });
    
    dispatch({
      type: 'store/fetchRole',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { store } = this.props;
    if (nextProps.store !== store) {
      const tableDate = nextProps.store.employeeData;
      const tableDateLength = tableDate.length;
      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.store.from + i;
      }
      this.setState({
        employeeData: tableDate,
        total:nextProps.store.total,
      });
    }

  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  // 点击修改员工按钮
  update = record => {
    this.setState({
      updatevisible: true,
      initialValue: record,
    });
  };

  // 编辑员工取消
  updatehandleCancel = () => {
    this.setState({
      initialValue: {},
      updatevisible: false,
    });
  };

  // 点击添加员工按钮
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  
  // 修改密码
  updatePassword = (record) => {
    if(!record.is_login){
      message.warning('该用户禁止登录')
      return;
    }

    this.setState({
      passwordVisible: true,
    })
    
    // record
  };

  // 编辑员工请求
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/fetchEmployeeUpdate',
      payload: fields,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          dispatch({
            type: 'store/fetchEmployee',
          });
          this.setState({
            updatevisible: false,
            initialValue: {},
          });
        }
      },
    });
  }

  // 添加员工请求
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/fetchEmployeeAdd',
      payload: fields,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          dispatch({
            type: 'store/fetchEmployee',
          });
          this.setState({
            modalVisible: false,
          });
        }
      },
    });
  }

  // 删除员工
  del = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/fetchEmployeeDel',
      payload: {
        id,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          dispatch({
            type: 'store/fetchEmployee',
          });
        }
      },
    });
  }
  
  // 列配置返回
  newColumn = (data) => {
    localStorage.setItem('storeColumn', JSON.stringify(data));
    const getColumns = JSON.parse(localStorage.getItem('storeColumn'))
    this.setState({
      getColumns,
    })
  }

  columns = (columns)=>{
    const { getColumns } = this.state;
    columns.unshift({
      title: (<ColumnConfig minCol={4} columns={getColumns} defaultColumns={employeeColumns} callback={this.newColumn} />),
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width:64,
      })
    columns.push({
      title: '操作',
      key: 'operation',
      width:246,
      render: record => {
        return (
          <Fragment>
            <Link to={{ pathname: '/salesDetails/salesSlip', state: { operator_id: record.id } }}>
              销售单
            </Link>
            <Divider type="vertical" />
            <a style={{ color: '#faad14' }} onClick={() => this.update(record)}>
              修改
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.updatePassword(record)} style={{ color: '#faad14' }}>
              修改密码
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.del(record.id)}>
              <a style={{ color: '#f5222d' }}>删除</a>
            </Popconfirm>
          </Fragment>
        );
      },
    },)  
    // 给列加上render等
    for (let i = 0; i < columns.length; i++) {
      if(columns[i].dataIndex === 'is_login'){
        columns[i].render = (record)=>
          record === 1 ? (
            <Badge status="success" text="允许" />
          ) : (
            <Badge status="error" text="禁止" />
          )
      }
      if(columns[i].dataIndex === 'state'){
        columns[i].render = (record)=>
          record === 1 ? <Badge status="success" text="在职" /> : <Badge status="error" text="离职" />
      }
    }
    return columns;
  }

  
  handleConfirmBlur = e => {
    const { confirmDirty } = this.state;
    const { value } = e.target;
    this.setState({ confirmDirty:confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible , confirmDirty} = this.state;
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        console.log(values)
        // this.props.dispatch({
        //   type: 'register/submit',
        //   payload: {
        //     ...values,
        //   },
        // });
      }
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };


  render() {
    const { modalVisible,visible, employeeData, updatevisible,getColumns,total,initialValue,passwordVisible,help } = this.state;
    const { loading ,form } = this.props;

    const parentAddMethods = {
      visible:modalVisible,
      onOk: this.handleAdd,
      title:'添加员工', 
      onCancel: this.handleModalVisible,

    };
    const parentUpdateMethods = {
      visible:updatevisible,
      title:'修改员工信息',
      initialValue, // 默认值
      onOk: this.handleUpdate,
      onCancel: this.updatehandleCancel,
      destroyOnClose:true,
    };

    const columns = [];  
    for (let i = 0; i < getColumns.length; i++) {
      if(getColumns[i].visible) columns.push(getColumns[i])
    }
    this.columns(columns)


    return (
      <PageHeaderWrapper 
        title='员工管理'  
        content={<p>员工数 : {total}/10</p>}
        extraContent={
          <div>
            <Link to={{ pathname: '/setting/permissionSetting'}}>
              <Button className={commonStyle.topButton} style={{marginRight:5}}>权限配置</Button>
            </Link>
            <Button type="primary" onClick={() => this.handleModalVisible(true)}>添加员工</Button>
          </div>} 
      >
        <Card className={commonStyle.rowBackground}>
          <Table
            className={commonStyle.tableAdaption}
            dataSource={employeeData}
            columns={columns}
            loading={loading}
            pagination={false}
            bordered={true}
            rowKey={record => record.id}
          />
        </Card>
        <EmployeeModal {...parentAddMethods} />
        <EmployeeModal {...parentUpdateMethods} />
        <Modal
          title='修改密码'
          visible={passwordVisible}
          onCancel={()=>{this.setState({passwordVisible:false,visible:false})}}
          onOk={this.handleSubmit}
          destroyOnClose
        >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="新密码" help={help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    <a onClick={()=>this.setState({visible:false})}>知道了</a>
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {form.getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input type="password" placeholder="至少6位密码，区分大小写" />)}
            </Popover>
          </FormItem>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="确认新密码">
            {form.getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input type="password" placeholder="确认密码" />)}
          </FormItem>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default EmployeeManagement