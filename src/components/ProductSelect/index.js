import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Table, Checkbox, Button, Divider, Modal, message } from 'antd';

import ProductAdd from '@/components/ProductAdd';
import CategorySelect from '@/components/CategorySelect';
import commonStyle from '../../global.less'; // 公共样式
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
class ProductSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productData: [], // 货品列表
      categoryData: [], // 货品类别
      saleGoodsKeys: [], // 选中货品的key
      saleGoods: [], // 选中货品的具体对象
      isZero:false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/productListind', // 货品列表
      payload: {
        page: 1,
      },
    });
    dispatch({
      type: 'product/categoryinf', // 货品类别
    });
    dispatch({
      type: 'product/unitsinf', // 货品单位
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.props.product) {
      const categoryData = [nextProps.product.categoryData];
      this.setState({
        productData: nextProps.product.productData,
        categoryData,
        unitsData: nextProps.product.unitsData,
        productTotal: nextProps.product.productTotal,
      });
    }
  }

  onOk = () => {
    this.props.addSelectGoods(this.state.saleGoods);
    this.setState({
      saleGoodsKeys: [],
      saleGoods: [],
    });
  };

  /**
   * 添加货品点击行
   */
  selectGoods = value => {
    if (!this.props.isReturn)
      if (value.stock === 0) {
        message.error('货品库存不足');
        return;
      }

    const { saleGoodsKeys ,saleGoods } = this.state;

    saleGoodsKeys.unshift(value.id);
    saleGoods.unshift(value);
    let count = 0;
    for (let i = 0; i < saleGoodsKeys.length; i++) {
      if (saleGoodsKeys[i] === value.id) {
        count++;
      }
    }
    if (count > 1) {
      saleGoodsKeys.shift();
      saleGoods.shift();
      for (let i = 0; i < saleGoodsKeys.length; i++) {
        if (saleGoodsKeys[i] === value.id) {
          saleGoodsKeys.splice(i, 1);
          saleGoods.splice(i, 1);
          break;
        }
      }
    }
    this.setState({
      saleGoodsKeys,
      saleGoods,
    });
  };

  /**
   * 添加货品后调用
   */
  addProduct = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/productListind', // 货品列表
      payload: {
        page: 1,
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.page = 1;
        values.stock = Number(values.stock);
        this.props.dispatch({
          type: 'product/productListind', // 货品列表
          payload: values,
        });
      }
    });
  }

  reset = () =>{
    this.props.form.resetFields();
    this.setState({
      isZero:false,
    })
    this.props.dispatch({
      type: 'product/productListind', // 货品列表
      payload: {
        page:1,
      },
    });
  }

  checkbox = (e) =>{
    this.setState({
      isZero:e.target.checked,
    })
  }

  render() {
    const { categoryData, productData, productTotal, unitsData } = this.state;
    const {
      form,
      visible,
      addGoodsClose,
      supplierData, // 供应商
      loading,
    } = this.props;

    // 货品选择
    const goodsSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          saleGoodsKeys: selectedRowKeys,
          saleGoods: selectedRows,
        });
      },
      selectedRowKeys: this.state.saleGoodsKeys,
      getCheckboxProps: record => ({
        disabled: this.props.isReturn ? false : record.stock === 0,
      }),
    };
    const columns = [
      {
        title: '条形码',
        dataIndex: 'bar_code',
        key: 'bar_code',
      },
      {
        title: '货品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
      },
      {
        title: '单位',
        dataIndex: 'unit.name',
        key: 'unit.name',
      },
      {
        title: '零售价',
        dataIndex: 'retail_price',
        key: 'retail_price',
      },
      {
        title: '批发价',
        dataIndex: 'wholesale_price',
        key: 'wholesale_price',
      },
      {
        title: '采购价',
        dataIndex: 'purchase_cost',
        key: 'purchase_cost',
      },
      
      {
        title: '规格',
        dataIndex: 'spece',
        key: 'spec',
      },
    ];

    return (
      <Modal
        style={{ top: 20 }}
        title="选择货品"
        width={1000}
        onOk={this.onOk}
        onCancel={addGoodsClose}
        visible={visible}
      >
        <Row>
          <Col xs={24} sm={24} md={22} lg={22} xl={22} style={{ marginTop: 5 }}>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <FormItem label="搜索货品">
                {form.getFieldDecorator('goods_name')(<Input placeholder="货品名/条码" />)}
              </FormItem>
              <FormItem label="货品类别">
                {form.getFieldDecorator('category_id')(<CategorySelect treeData={categoryData} />)}
              </FormItem>
              <FormItem>
                {form.getFieldDecorator('stock',{
                })(
                  <Checkbox onChange={this.checkbox} checked={this.state.isZero} className={styles.orderNum}>隐藏零库存</Checkbox>
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" style={{marginRight:2}}>
                  查询
                </Button>
                <Button onClick={()=>this.reset()}>
                  重置
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col xs={24} sm={24} md={2} lg={2} xl={2} style={{ marginTop: 8 }}>
            <ProductAdd
              categoryTreeData={categoryData}
              supplierData={supplierData}
              unitsData={unitsData}
              callParent={this.addProduct}
            />
          </Col>
        </Row>
        <Divider />
        <Table
          className={commonStyle.tableAdaption}
          dataSource={productData}
          loading={loading}
          pagination={{
            total: productTotal,
            defaultPageSize: 10,
            onChange: page => {
              this.props.dispatch({
                type: 'product/productListind',
                payload: {
                  page,
                },
              });
            },
          }}
          columns={columns}
          rowKey={record => record.id}
          locale={{ emptyText: '暂无货品' }}
          rowSelection={goodsSelection}
          onRow={record => {
            return {
              onClick: () => this.selectGoods(record), // 点击行
            };
          }}
        />
      </Modal>
    );
  }
}
export default ProductSelect