import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Card,
  Form,
  Input,
  Table,
  Popconfirm,
  Divider,
  Icon,
  Modal,
  Checkbox,
  Button,
  Row,
  Tree,
  Col,
  message,
  Select,
  TreeSelect,
  InputNumber,
} from 'antd';
import Statistics from '@/components/Statistics';
import ProductAdd from '@/components/ProductAdd';
import ProductUpdate from '@/components/ProductUpdate';
import commonStyle from '../../global.less'; // 公共样式
// import styles from './ProductList.less'

const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

// 全部表头
const columnsAll = [
  {
    index: 0,
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    // className:styles.vis,
  },
  {
    index: 1,
    title: '条形码',
    dataIndex: 'bar_code',
    key: 'bar_code',
  },
  {
    index: 2,
    title: '货品图片',
    dataIndex: 'img_path',
    key: 'img_path',
  },
  {
    index: 3,
    title: '货品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    index: 4,
    title: '货品类别',
    dataIndex: 'category.name',
    key: 'category.name',
  },
  {
    index: 5,
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    index: 6,
    title: '供应商',
    dataIndex: 'supplier.name',
    key: 'supplier.name',
  },
  {
    index: 7,
    title: '单位',
    dataIndex: 'unit.name',
    key: 'unit.name',
  },
  {
    index: 8,
    title: '批发价',
    dataIndex: 'wholesale_price',
    key: 'wholesale_price',
  },
  {
    index: 9,
    title: '库存成本',
    dataIndex: 'inventory_cost',
    key: 'inventory_cost',
  },
  {
    index: 10,
    title: '成本价',
    dataIndex: 'unit_cost',
    key: 'unit_cost',
  },
  {
    index: 11,
    title: '采购价',
    dataIndex: 'purchase_cost',
    key: 'purchase_cost',
  },
  {
    index: 12,
    title: '零售价',
    dataIndex: 'retail_price',
    key: 'retail_price',
  },
  {
    index: 13,
    title: '规格',
    dataIndex: 'spece',
    key: 'spec',
  },
];

// 本地存储 表头信息
if (localStorage.getItem('ProductListColumns') === null) {
  const tmp = columnsAll.slice(0, 5);

  // 存数组 转String
  localStorage.setItem('ProductListColumns', JSON.stringify(tmp));
}
const checkedLocal = JSON.parse(localStorage.getItem('ProductListColumns'));

for (let i = 0; i < checkedLocal.length; i++) {
  checkedLocal[i] = JSON.stringify(checkedLocal[i]);
}

// Checkbox组件 Table表头设置 多选框
const checkboxAllData = [];
for (let i = 0; i < columnsAll.length; i += 1) {
  checkboxAllData.push(
    <Col span={8} key={columnsAll[i].title}>
      <Checkbox value={JSON.stringify(columnsAll[i])}>{columnsAll[i].title}</Checkbox>
    </Col>
  );
}
// 操作表头
const operationAll = [
  {
    reportLoss: true,
    name: '报损',
  },
  {
    shipments: true,
    name: '出货',
  },
  {
    purchase: true,
    name: '进货',
  },
  {
    update: true,
    name: '修改',
  },
  {
    delete: true,
    name: '删除',
  },
  {
    entryRecord: true,
    name: '进销记录',
  },
  // {
  //   copyGoods: true,
  //   name: '复制货品',
  // },
];

// 本地存储 表头信息
if (localStorage.getItem('GoodsOperationLink') === null) {
  const tmp = operationAll.slice(0, 5);

  // 存数组 转String
  localStorage.setItem('GoodsOperationLink', JSON.stringify(tmp));
}
const operationLocal = JSON.parse(localStorage.getItem('GoodsOperationLink'));

for (let i = 0; i < operationLocal.length; i++) {
  operationLocal[i] = JSON.stringify(operationLocal[i]);
}

// Checkbox组件 Table表头设置 多选框
const checkboxLink = [];
for (let i = 0; i < operationAll.length; i += 1) {
  checkboxLink.push(
    <Col span={8} key={i}>
      <Checkbox value={JSON.stringify(operationAll[i])}>{operationAll[i].name}</Checkbox>
    </Col>
  );
}


// 添加报损Modal
const CreateLossEmpForm = Form.create()(props => {
  const {
    modalVisibleLoss,
    form,
    ProductCancel,
    initialValueLossModal,
    causeOfLossData,
    handleLossModal,
  } = props;
  const cancel = () => {
    form.resetFields();
    ProductCancel();
  };
  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleLossModal(fieldsValue);
    });
  };

  return (
    <Modal
      title="添加报损"
      visible={modalVisibleLoss}
      onOk={handleOk}
      onCancel={cancel}
      width={400}
    >
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="货品名称">
        {form.getFieldDecorator('name', {
          initialValue: initialValueLossModal.name,
        })(<Input placeholder="请输入货品名称" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="货品数量">
        {form.getFieldDecorator('number', {
          rules: [
            { required: true, message: '货品数量不能为空' },
            {
              validator(rule, values, callback) {
                if (values > initialValueLossModal.stock) {
                  callback('报损数量大于库存数量！！！');
                } else callback();
              },
            },
          ],
          initialValue: 1,
        })(<InputNumber />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="报损原因">
        {form.getFieldDecorator('loss_id', {
          rules: [{ required: true, message: '请选择报损原因' }],
        })(
          <Select style={{ width: 220 }}>
            {causeOfLossData.map(id => {
              return (
                <Option key={id.id} value={id.id}>
                  {id.reason}
                </Option>
              );
            })}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});
// 条件查询组件
const Conditional = Form.create()(props => {
  const {
    form,
    queryData,
    renderTreeNodes,
    categoryTreeData,
    supplierData,
    unitsData,
    callParent,
    queryReset,
    stock,
  } = props;

  const query = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // console.log(fieldsValue);
      queryData(fieldsValue);
    });
  };
  const reset = () => {
    form.resetFields();
    queryReset()
  };
  return (
    <Row gutter={8}>
      <Col xs={24} sm={12} md={12} lg={12} xl={5} xxl={4}>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="搜索货品"
          style={{ marginBottom: '0px' }}
        >
          {form.getFieldDecorator('goods_name', {})(
            <Search
              // size='small'
              placeholder="搜索货品名称或条形码"
              onSearch={value => query(value)}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={5} xxl={4}>
        <FormItem
          style={{ marginBottom: '0px' }}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          label="货品类别"
        >
          {form.getFieldDecorator('category_id',{
            // initialValue: 1,
          })(
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear={false}
              treeDefaultExpandAll
              // size='small'
            >
              {renderTreeNodes(categoryTreeData)}
            </TreeSelect>
          )}
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={5} xxl={5}>
        <Col span={12}>
          <FormItem style={{ marginBottom: '0px' }}>
            {form.getFieldDecorator('xsyyjkc', {})(<Checkbox>已预警库存</Checkbox>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem style={{ marginBottom: '0px' }}>
            {form.getFieldDecorator('stock', {
              initialValue:{stock},
            })(<Checkbox>隐藏零库存</Checkbox>)}
          </FormItem>
        </Col>
      </Col>
      <Col xs={24} sm={6} md={6} lg={6} xl={4} xxl={5} style={{ margin: '5px 0 5px 0px' }}>
        <Button onClick={query} style={{ marginRight: 5 }} type="primary">
          查询
        </Button>
        <Button onClick={reset} style={{ marginRight: 5 }}>
          重置
        </Button>
      </Col>
      <Col
        xs={24}
        sm={6}
        md={6}
        lg={6}
        xl={{ span: 4, push: 1 }}
        xxl={{ span: 4, push: 3 }}
        style={{ margin: '5px 0 5px 0px' }}
      >
        <ProductAdd
          categoryTreeData={categoryTreeData} // 类别
          supplierData={supplierData} // 供应商
          unitsData={unitsData} // 单位
          callParent={callParent} // 添加完成后调用
        />
        <Link to="/openbill/sellinggoods" style={{ marginLeft: 5 }}>
          <Button type="primary">开单</Button>
        </Link>
      </Col>
    </Row>
  );
});
@connect(({ product, supplier, loading }) => ({
  product,
  supplier,
  loading: loading.models.product,
}))
@Form.create()
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productData: [], // 初始化表格数据
      checkedValue: checkedLocal, // 多选框的选中
      setColvisible: false, // 初始化表头设置Modal 隐藏
      initialValueUpdate: {}, // 初始化修改货品Modal 默认值
      modalVisibleLoss: false, // 初始化报损Modal 隐藏
      initialValueLoss: {}, // 初始化报损Modal 默认值
      categoryData: [],
      productTotal: 0,
      operationLink: operationLocal,
      current: 1, // 当前页数
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { current }=this.state;
    dispatch({
      type: 'product/productListind', // 货品列表
      payload: {
        page:current,
      },
    });
    dispatch({
      type: 'product/categoryinf', // 货品类别
    });
    dispatch({
      type: 'product/unitsinf', // 货品单位
    });
    dispatch({
      type: 'supplier/supplierinf', // 供应商
      payload: {
        page: 1,
        name: '',
      },
    });
    dispatch({
      type: 'product/causeoflossinf', // 报损原因
    });
  }

  // props 改变时调用
  componentWillReceiveProps(nextProps) {
    const { product , supplier} = this.props;
    if (nextProps.product !== product) {
      const tableDate = nextProps.product.productData;

      const tableDateLength = tableDate.length;

      for (let i = 0; i < tableDateLength; i++) {
        tableDate[i].index = nextProps.product.dataFrom + i;
      }

      const categoryData = [nextProps.product.categoryData];
      this.setState({
        productData: tableDate,
        productTotal: nextProps.product.productTotal,
        categoryData,
      });
    }
    if (nextProps.supplier !== supplier) {
      this.setState({
        supplierData: nextProps.supplier.supplierData,
      });
    }
  }

  // 搜索
  onSearch = value => {
    console.log(value);
  };

  // 表头设置 按钮click
  setting = () => {
    this.setState({
      setColvisible: true,
    });
  };

  // 保存表头设置
  settingOk = () => {
    this.setState({
      setColvisible: false,
    });
  };

  // 表头设置Modal返回 隐藏
  settingCancel = () => {
    this.setState({
      setColvisible: false,
    });
  };

  // checkbox onChange
  checkOnChange = checkedValues => {
    if (checkedValues.length >= 5) {
      const tmp = [];

      for (let i = 0; i < checkedValues.length; i++) {
        tmp.push(JSON.parse(checkedValues[i]));
      }

      // 存数组 转String

      localStorage.setItem('ProductListColumns', JSON.stringify(tmp));
    } else {
      message.error('列表字段至少显示五个');
      return;
    }

    this.setState({
      checkedValue: checkedValues,
    });
  };

  checkOperation = checkedValues => {
    if (checkedValues.length >= 1) {
      const tmp = [];

      for (let i = 0; i < checkedValues.length; i++) {
        tmp.push(JSON.parse(checkedValues[i]));
      }

      // 存数组 转String

      localStorage.setItem('GoodsOperationLink', JSON.stringify(tmp));
    } else {
      message.error('列表字段至少显示一个');
      return;
    }

    this.setState({
      operationLink: checkedValues,
    });
  };


  // 删除货品
  delProduct = record => {
    const { dispatch } = this.props;
    const { productData ,current } = this.state;
    const productlength = productData.length;
    dispatch({
      type: 'product/productListdel',
      payload: {
        id: record.id,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          if (productlength === 1) {
            dispatch({
              type: 'product/productListind',
              payload: {
                page: current - 1,
              },
            });
          } else {
            dispatch({
              type: 'product/productListind',
              payload: {
                page: current,
              },
            });
          }
        }
      },
    });
  };

  // 更新货品(修改按钮)
  updateProduct = record => {
    this.setState({
      initialValueUpdate: record,
    });
  };

  // 报损(click)
  reportLoss = record => {
    this.setState({
      modalVisibleLoss: true,
      initialValueLoss: record,
    });
  };

  // 添加报损请求
  handleLossModal = fields => {
    const { dispatch } = this.props;
    const { initialValueLoss , current } = this.state;
    delete fields.name;
    fields.unit_cost = initialValueLoss.unit_cost;
    fields.old_stock = initialValueLoss.stock;
    fields.goods_id = initialValueLoss.id;

    dispatch({
      type: 'product/reportLossadd',
      payload: fields,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            modalVisibleLoss: false,
          });
          
        }
      },
    });
    const stockTmp = initialValueLoss.stock - fields.number;
    dispatch({
      type: 'product/productListupdate',
      payload: {
        id: initialValueLoss.id,
        stock: stockTmp,
        unit_cost: initialValueLoss.unit_cost,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          this.setState({
            modalVisibleLoss: false,
          });
          dispatch({
            type: 'product/productListind',
            payload: {
              page:current,
            },
          });
        }
      },
    });
  };

  /**
   * 统计开关
   */
  switchange = checked => {
    this.setState({ switchLoding: !checked });
    if (checked) {
      localStorage.setItem('switchLoding', 1);
    } else {
      localStorage.setItem('switchLoding', 0);
    }
  };

  myArraySort = (obj1, obj2) => {
    const val1 = obj1.index;
    const val2 = obj2.index;
    if (val1 > val2) {
      return 1;
    } else if (val1 < val2) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * 查询
   */
  queryData = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/productListind', // 获取销售单据
      payload:fields,
    });
    // console.log(fields);
  }


  queryReset=()=>{
    const { dispatch } = this.props;
    this.setState({
      stock:false,
    })
    dispatch({
      type: 'product/productListind', // 获取销售单据
      payload: {
      
        page: 1,
      },
    });
  }

  callParent = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'product/productListind', // 获取销售单据
      payload: {
      
        page: 1,
      },
    });
  }

  // 渲染树子节点
  renderTreeNodes = data => {
    if (data[0] !== undefined) {
      return data.map(item => {
        // console.log(item.id)
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.id} value={String(item.id)}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.name} key={item.id} value={String(item.id)} />;
      });
    }
  };

  render() {
    const { loading, product , dispatch } = this.props;
    const { unitsData, causeOfLossData } = product;
    const {
      supplierData,
      categoryData,
      productData,
      initialValueUpdate,
      modalVisibleLoss,
      initialValueLoss,
      switchLoding,
      stock,
      setColvisible,
      checkedValue,
      operationLink,
      productTotal,
    } = this.state;

    // 操作 title
    const operationtitle = (
      <span>
        操作
        <Icon
          type="setting"
          style={{ cursor: 'pointer', fontSize: 26, color: '#08c', float: 'right' }}
          onClick={() => this.setting()}
        />
      </span>
    );

    const operationRecord = JSON.parse(localStorage.getItem('GoodsOperationLink'));
    const operationJson = {};
    const opLength = operationRecord.length;
    for (let i = 0; i < opLength; i++) {
      for (const key in operationRecord[i])
        if ({}.hasOwnProperty.call(operationRecord[i], key)) {
          if (key !== 'name') operationJson[key] = operationRecord[i][key];
        }
    }
    // 操作列
    const operation = {
      index: 14,
      title: operationtitle,
      key: 'operation',
      width: 230,
      align: 'center',
      render: (text, record) => {
        return (
          <span>
            <span style={{ display: operationJson.reportLoss ? 'inline' : 'none' }}>
              <a style={{ color: '#1890ff' }} onClick={() => this.reportLoss(record)}>
                报损
              </a>
              <Divider type="vertical" />
            </span>
            <span style={{ display: operationJson.shipments ? 'inline' : 'none' }}>
              <Link
                to={{
                  pathname: '/openbill/sellinggoods',
                  state: {
                    data: record,
                  },
                }}
              >
                出货
              </Link>
              <Divider type="vertical" />
            </span>
            <span style={{ display: operationJson.purchase ? 'inline' : 'none' }}>
              <Link
                to={{
                  pathname: '/openbill/purchasepurchase',
                  state: {
                    data: record,
                  },
                }}
              >
                进货
              </Link>
              <Divider type="vertical" />
            </span>
            <span style={{ display: operationJson.entryRecord ? 'inline' : 'none' }}>
              <a style={{ color: '#1890ff' }}>进销记录</a>
              <Divider type="vertical" />
            </span>
            {/* <span style={{ display: operationJson.copyGoods ? 'inline' : 'none' }}>
              <a style={{ color: '#1890ff' }} onClick={() => this.copyProduct(record)}>
                复制货品
              </a>
              <Divider type="vertical" />
            </span> */}
            <span style={{ display: operationJson.update ? 'inline' : 'none' }}>
              <a style={{ color: '#FFC125' }} onClick={() => this.updateProduct(record)}>
                <ProductUpdate
                  initialValue={initialValueUpdate}
                  categoryTreeData={categoryData} // 类别
                  supplierData={supplierData} // 供应商
                  unitsData={unitsData} // 单位
                  callParent={this.callParent} // 添加完成后调用
                />
              </a>
              
              <Divider type="vertical" />
            </span>
            <span style={{ display: operationJson.delete ? 'inline' : 'none' }}>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.delProduct(record)}>
                <a style={{ color: '#FF4500' }}>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
            </span>
          </span>
        );
      },
    };

    // 给表头加上render
    let columns = [];
    columns = JSON.parse(localStorage.getItem('ProductListColumns'));
    for (let i = 0; i < columns.length; i++) {
      // 货品图片
      if (columns[i].dataIndex === 'img_path')
        columns[i].render = (text, record) => {
          return (
            <div style={{ width: '64px' }} dangerouslySetInnerHTML={{ __html: record.img_path }} />
          );
        };
    }
    columns.push(operation);
    columns.sort(this.myArraySort);

    // 报损 props
    const lossMethods = {
      ProductCancel: this.ProductCancel,
      initialValueLossModal: initialValueLoss,
      causeOfLossData,
      handleLossModal: this.handleLossModal,
    };

    const StatisticsMethods = {
      switchLoding,
      switchange: this.switchange,
      dataSource: [{ title: '货品总数', total: productTotal, units: '' }],
    };


    return (
      <div>
        <Card className={commonStyle.rowBackground}>
          <Conditional
            stock={stock}
            queryReset={this.queryReset}
            queryData={this.queryData}
            renderTreeNodes={this.renderTreeNodes}
            categoryTreeData={categoryData}
            supplierData={supplierData}
            unitsData={unitsData}
            callParent={this.callParent}
          />
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Statistics {...StatisticsMethods} />
        </Card>

        <Card className={commonStyle.rowBackground}>
          <Table
            className={commonStyle.tableAdaption}
            dataSource={productData}
            columns={columns}
            rowKey={record => record.id}
            locale={{ emptyText: '暂无货品' }}
            pagination={{
              total: productTotal,
              defaultPageSize: 10,
              onChange: page => {
                dispatch({
                  type: 'product/productListind',
                  payload: {
                    page,
                  },
                });
              },
            }}
            loading={loading}
          />
        </Card>
        {/* 表头设置Modal */}
        <Modal
          // title="列表设置"
          visible={setColvisible}
          onOk={this.settingOk}
          okText="保存"
          onCancel={this.settingCancel}
        >
          <Divider orientation="left">列表设置</Divider>
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={this.checkOnChange}
            value={checkedValue}
          >
            <Row>{checkboxAllData}</Row>
          </Checkbox.Group>
          <Divider orientation="left">操作设置</Divider>
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={this.checkOperation}
            value={operationLink}
          >
            <Row>{checkboxLink}</Row>
          </Checkbox.Group>
        </Modal>
        <CreateLossEmpForm {...lossMethods} modalVisibleLoss={modalVisibleLoss} />
      </div>
    );
  }
}

export default ProductList