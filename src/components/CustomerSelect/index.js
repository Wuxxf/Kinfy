import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Table, Divider, Modal } from 'antd';

import CustomerAddSimple from '@/components/CustomerAddSimple';
import commonStyle from '../../global.less'; // 公共样式

const { Search } = Input;

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
}))
@Form.create()
class CustomerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/customerinf', // 客户列表
      payload: {
        page: 1,
      },
    });
  }

  // props 改变时调用
  componentWillReceiveProps(nextProps) {
    if (nextProps.customer !== this.props.customer) {
      this.setState({
        customerData: nextProps.customer.customerData,
        customerTotal: nextProps.customer.customerTotal,
      });
    }
  }
  
  addCustomer = () => {
    this.setState({
      addVisible: true,
    });
  };

  customerSearch = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/customerinf', // 客户列表
      payload: {
        customer_name:e,
        page: 1,
      },
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/customerinf', // 客户列表
      payload: {
        page: 1,
      },
    });
    this.setState({
      addVisible: false,
    });
  };

  render() {
    const { customerVisible, closeCustomer, selectCust, form, loading } = this.props;
    const columns = [
      {
        title: '客户名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '客户类型',
        dataIndex: 'customer_type',
        key: 'customer_type',
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
        key: 'contacts',
      },
      {
        title: '手机',
        dataIndex: 'mobile_phone',
        key: 'mobile_phone',
      },
      {
        title: '应收欠款',
        dataIndex: 'pay',
        key: 'pay',
      },
    ];

    const onClose = () => {
      form.resetFields();
      this.setState({
        addVisible: false,
      });
    };

    return (
      <Modal
        style={{ top: 20 }}
        title="选择客户"
        width={1000}
        destroyOnClose={true}
        onCancel={closeCustomer}
        visible={customerVisible}
      >
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginTop: 5 }}>
            <span>搜索客户: </span>
            <Search
              placeholder="请输入客户名称"
              onSearch={this.customerSearch}
              style={{ width: 200 }}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={{ span: 3, push: 8 }}
            lg={{ span: 3, push: 8 }}
            xl={{ span: 3, push: 8 }}
            style={{ marginTop: 5 }}
          >
            <Button type="primary" onClick={this.addCustomer}>
              添加客户
            </Button>
          </Col>
        </Row>
        <Divider />
        <Table
          className={commonStyle.tableAdaption}
          loading={loading}
          dataSource={this.state.customerData}
          columns={columns}
          pagination={{
            total: this.state.customerTotal,
            defaultPageSize: 10,
            onChange: page => {
              this.props.dispatch({
                type: 'customer/customerinf',
                payload: {
                  page,
                },
              });
            },
          }}
          rowKey={record => record.id}
          onRow={record => {
            return {
              onClick: () => selectCust(record), // 点击行
            };
          }}
        />
        <CustomerAddSimple
          visible={this.state.addVisible}
          onClose={onClose}
          callpackParent={this.add}
        />
      </Modal>
    );
  }
}
export default CustomerModal