import React, { Component } from 'react';
import { connect } from 'dva';

import {
  Form,
  Col,
  Modal,
  Icon,
  Row,
  Tree,
  Input,
  Select,
  TreeSelect,
  Button,
  Tooltip,
  message,
  Divider,
  Upload,
} from 'antd';

const { Option } = Select;
const { TreeNode } = Tree;
const FormItem = Form.Item;

// 添加货品Modal

const AddProduct = Form.create()(props => {
  const {
    form,
    visible,
    onCancel,
    handleAdd,
    supplierData, // 供应商
    categoryTreeData, // 类别
    unitsData, // 单位
    renderTreeNodes,
    Uploadprops,
    fileList,
  } = props;
  const LableIcon = <Icon type="question-circle" />;
  const unitCostText =
    '成本价指的是货品的采购成本，用于计算销售利润。并根据每次采购价格的不同，进行平均计算。';
  const unitCost = (
    <span>
      成本价<Tooltip title={unitCostText}>{LableIcon}</Tooltip>
    </span>
  );
  const wholesalpriceText = '批发价指的是销售出货时，如果销售对象是批发客户，则会以批发价销售。';
  const wholesalprice = (
    <span>
      批发价<Tooltip title={wholesalpriceText}>{LableIcon}</Tooltip>
    </span>
  );
  const purchaseCostText =
    '采购价指的是货品的采购价格，采购时修改了采购价格，这里的采购价格也会同步被修改。';
  const purchaseCost = (
    <span>
      采购价<Tooltip title={purchaseCostText}>{LableIcon}</Tooltip>
    </span>
  );

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const uploadButton = (
    <div>
      <Icon type="plus" style={{ fontSize: 22 }} />
      <div>选择货品图片</div>
    </div>
  );

  return (
    <Modal
      title="添加货品"
      visible={visible}
      onOk={okHandle}
      onCancel={onCancel}
      destroyOnClose={true}
      width={810}
    >
      <Row gutter={24}>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="货品名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入货品名称' }],
            })(<Input placeholder="请输入货品名称" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="货品规格">
            {form.getFieldDecorator('spece')(<Input placeholder="货品规格" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Row>
            <Col span={23}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="货品类别">
                {form.getFieldDecorator('category_id',{
                   initialValue: 1,
                })(
                  <TreeSelect
                    style={{ width: 150 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' ,width:150}}
                    allowClear={false}
                    treeDefaultExpandedKeys={['1']}
                  >
                    {renderTreeNodes(categoryTreeData)}
                  </TreeSelect>
                )}
              </FormItem>
            </Col>
            {/* <Col span={1}>
              <Button shape="circle" style={{ marginTop: 5 }}>
                <Icon type="plus" theme="outlined" />
              </Button>
            </Col> */}
          </Row>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="库　　存">
            {form.getFieldDecorator('stock', {
              rules: [
                {pattern:/^(-?)[0-9]*$/,message:'请输入合法库存'},
              ],
              initialValue: 0,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label={unitCost}>
            {form.getFieldDecorator('unit_cost', {
              rules: [
                {pattern:/^[0-9]+(.[0-9]{1,2})?$/,message:'请输入正确金额'},
              ],
              initialValue: 0,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="供&nbsp;应&nbsp;商">
            {form.getFieldDecorator('supplier_id', {
              rules: [{ required: true, message: '请选择供应商' }],
            })(
              <Select style={{ width: 170 }}>
                {supplierData.map(id => {
                  return (
                    <Option key={id.id} value={id.id}>
                      {id.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label={wholesalprice}>
            {form.getFieldDecorator('wholesale_price', {
              rules: [
                {pattern:/^[0-9]+(.[0-9]{1,2})?$/,message:'请输入正确金额'},
              ],
              initialValue: 0,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label={purchaseCost}>
            {form.getFieldDecorator('purchase_cost', {
              rules: [
                {pattern:/^[0-9]+(.[0-9]{1,2})?$/,message:'请输入正确金额'},
              ],
              initialValue: 0,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="零 售 价">
            {form.getFieldDecorator('retail_price', {
              rules: [
                {pattern:/^[0-9]+(.[0-9]{1,2})?$/,message:'请输入正确金额'},
              ],
              initialValue: 0,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="最低库存">
            {form.getFieldDecorator('min_stock', {
              rules: [
                {pattern:/^(-?)[0-9]*$/,message:'请输入合法库存数'},
              ],
              initialValue: 0,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="最高库存">
            {form.getFieldDecorator('max_stock', {
              rules: [
                {pattern:/^(-?)[0-9]*$/,message:'请输入合法库存数'},
              ],
              initialValue: 0,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单　　位">
            {form.getFieldDecorator('unit_id', {})(
              <Select style={{ width: 170 }} placeholder="请选择">
                {unitsData.map(id => {
                  return (
                    <Option key={id.id} value={id.id}>
                      {id.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Divider />
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            {form.getFieldDecorator('img_info', {
              rules: [
                {
                  validator(rue, values, callback) {
                    if (!values) {
                      callback();
                    } else if (values.fileList.length === 0) {
                      form.setFieldsValue({ img_info: undefined });
                      callback();
                    } else {
                      const isJPG =
                        values.file.type === 'image/jpeg' || values.file.type === 'image/png';
                      const isLt2M = values.file.size / 1024 / 1024 < 2;
                      if (!isJPG) {
                        callback('只能选择jpg/png格式图片!');
                      } else if (!isLt2M) {
                        callback('图片不超过2MB!');
                      } else callback();
                    }
                  },
                },
              ],
            })(
              <Upload {...Uploadprops} listType="picture-card">
                {fileList.length > 0 ? null : uploadButton}
              </Upload>
            )}
          </FormItem>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="货品状态">
            {form.getFieldDecorator('state', {
              initialValue: 1,
            })(
              <Select style={{ width: 160 }}>
                <Option value={0}>禁用</Option>
                <Option value={1}>启用</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="条&nbsp;&nbsp;形&nbsp;&nbsp;码"
          >
            {form.getFieldDecorator('bar_code', {
              initialValue: Date.parse(new Date()),
            })(<Input disabled />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class ProductAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      visible: false,
      previewVisible: false,
      previewImage: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/storeind',
      callback: () => {
        dispatch({
          type: 'store/storeinf',
        });
      },
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
      fileList: [],
    });
  };

  showAddModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleAdd = fields => {
    this.setState({
      fileList: [],
    });
    this.setState(
      {
        visible: false,
      },
      () => {
        this.props.dispatch({
          type: 'product/productListadd',
          payload: fields,
          callback: res => {
            if (res.errcode) {
              message.error(res.msg);
              this.setState({
                visible: true,
              });
            } else {
              message.success(res.msg);
              this.props.callParent(res.data);
            }
          },
        });
      }
    );
  };

  handleCancel = () => this.setState({ previewVisible: false });

  // 渲染树子节点
  renderTreeNodes = data => {
    if (data[0] === null) {
      return;
    }
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value={String(item.id)}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={String(item.id)} />;
    });
  };

  render() {
    const { visible, previewVisible, previewImage } = this.state;

    let { supplierData, unitsData } = this.props;

    if (!supplierData) {
      supplierData = [];
    }
    if (!unitsData) {
      unitsData = [];
    }

    const Uploadprops = {
      onRemove: file => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      onPreview: file => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      },
      // fileList: this.state.fileList,
    };

    const methods = {
      onCancel: this.onCancel,
      handleAdd: this.handleAdd,
      renderTreeNodes: this.renderTreeNodes,
      categoryTreeData: this.props.categoryTreeData,
      supplierData,
      unitsData,
      Uploadprops,
      fileList: this.state.fileList,
      resetFileList: this.resetFileList,
    };

    return (
      <span>
        <Button type="primary" onClick={this.showAddModal}>
          添加货品
        </Button>
        <AddProduct visible={visible} {...methods} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="无法显示" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </span>
    );
  }
}
