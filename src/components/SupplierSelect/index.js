import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Table, Divider, Modal } from 'antd';

import SupplierAdd from '@/components/SupplierAdd';
import commonStyle from '../../global.less'; // 公共样式

const { Search } = Input;

@connect(({ supplier, loading }) => ({
  supplier,
  loading: loading.models.supplier,
}))
@Form.create()
class SupplierModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierData: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'supplier/supplierinf', // 供应商列表
      payload: {
        page: 1,
      },
    });
  }

  // props 改变时调用
  componentWillReceiveProps(nextProps) {
    if (nextProps.supplier !== this.props.supplier) {
      this.setState({
        supplierData: nextProps.supplier.supplierData,
        supplierTotal: nextProps.supplier.supplierTotal,
      });
    }
  }

  search = e => {
    console.log(e);
  };

  add = () => {
    this.props.dispatch({
      type: 'supplier/supplierinf', // 供应商列表
      payload: {
        page: 1,
      },
    });
  };

  render() {
    const {
      supplierVisible,

      closeSupplier,

      selectCust,
      loading,
    } = this.props;
    const { supplierData, supplierTotal } = this.state;
    const columns = [
      {
        title: '供应商名称',
        dataIndex: 'name',
        key: 'name',
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
        title: '应付欠款',
        dataIndex: 'pay',
        key: 'pay',
      },
    ];

    return (
      <Modal
        title="选择供应商"
        width={1000}
        destroyOnClose={true}
        onCancel={closeSupplier}
        visible={supplierVisible}
      >
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginTop: 5 }}>
            <span>搜索供应商: </span>
            <Search placeholder="请输入供应商名称" onSearch={this.search} style={{ width: 200 }} />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={{ span: 3, push: 8 }}
            lg={{ span: 3, push: 8 }}
            xl={{ span: 3, push: 8 }}
            style={{ marginTop: 5 }}
          >
            <SupplierAdd callpackParent={this.add} />
          </Col>
        </Row>
        <Divider />
        <Table
          className={commonStyle.tableAdaption}
          loading={loading}
          dataSource={supplierData}
          columns={columns}
          pagination={{
            total: supplierTotal,
            defaultPageSize: 10,
            onChange: page => {
              this.props.dispatch({
                type: 'supplier/supplierinf',
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
      </Modal>
    );
  }
}
export default SupplierModal
