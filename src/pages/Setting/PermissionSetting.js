import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Popconfirm, Table ,Button,Divider} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import EditableTable from 'components/EditableTable';

import commonStyle from '../../global.less'; // 公共样式

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
class PermissionSetting extends Component {
  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'store/storeind',
    //   callback: () => {
    //     dispatch({
    //       type: 'store/storeinf',
    //     });
    //   },
    // });
  }
  // componentWillReceiveProps(nextProps) {

  // }
  handleDelete = (id) =>{
    console.log(id)
  }

  addRole = flag => {
    this.setState({
      visible: !!flag,
    });
  };

  showDetails = (record)=>{
    console.log(record)
  }

  render() {
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (record) => {
          return (
            <div>
              <a onClick={() => this.showDetails(record)}>详情</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除该权限角色?" onConfirm={() => this.handleDelete(record.key)}>
                <a style={{color:'#f5222d'}}>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    const dataSource = [
      {
        id: 0,
        name: '销售',
        remarks: '这是个销售角色',
      },
      {
        id: 1,
        name: '管理员',
        remarks: '这是个管理员',
      },
    ];
    return (
      <PageHeaderWrapper
        title="权限管理"
        action={
          <div>
            <Link to={{ pathname: '/storeManagement/employeeManagement'}}>
              <Button className={commonStyle.topButton} style={{marginRight:5}}>员工管理</Button>
            </Link>
            <Button type="primary" onClick={() => this.addRole(true)}>添加角色</Button>
          </div>}
      >
          
        <div className={commonStyle.rowBackground}>
          <Table  
            dataSource={dataSource}
            columns={columns} 
            bordered
          />
          {/* <EditableTable dataSource={dataSource} columns={columns} /> */}
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default PermissionSetting