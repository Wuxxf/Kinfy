import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Tree, Row, Col, Button, Modal, message ,Card} from 'antd';

import Category from '@/components/Category';
import styles from './ProductCategory.less';
import commonStyle from '../../global.less'; // 公共样式

const { TreeNode } = Tree;

const { confirm } = Modal;

// 更新类别Modal
// const CreateUpdateCatForm = Form.create()(props => {
//   const {
//     updateVisible,
//     categoryDataUp,
//     selectedKeysUp,
//     form,
//     handleupdate,
//     handleupdateCancel,
//   } = props;
//   const initialValueid = Number(selectedKeysUp.toString());
//   const initialValueData = categoryDataUp.filter(item => item.id === initialValueid);
//   // 设置默认值
//   let initialValuepid = null;
//   let initialValuename = null;
//   if (initialValueData.length) {
//     initialValuepid = initialValueData[0].pid;
//     initialValuename = initialValueData[0].name;
//   }
//   const okHandle = () => {
//     form.validateFields((err, fieldsValue) => {
//       if (err) return;
//       form.resetFields();
//       handleupdate(fieldsValue, initialValueid);
//     });
//   };
//   return (
//     <Modal
//       title="修改类别"
//       visible={updateVisible}
//       onOk={okHandle}
//       onCancel={() => handleupdateCancel()}
//     >
//       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级类别">
//         {form.getFieldDecorator('pid', {
//           rules: [{ required: true, message: '请选择上级类别' }],
//           initialValue: initialValuepid,
//         })(
//           <Select style={{ width: 150 }} placeholder="请选择上级类别">
//             {categoryDataUp.map(id => {
//               return (
//                 <Option key={id.id} value={id.id}>
//                   {id.name}
//                 </Option>
//               );
//             })}
//           </Select>
//         )}
//       </FormItem>
//       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类别名称">
//         {form.getFieldDecorator('name', {
//           rules: [{ required: true, message: '请输入类别' }],
//           initialValue: initialValuename,
//         })(<Input placeholder="请输入类别" />)}
//       </FormItem>
//     </Modal>
//   );
// });

@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
class ProductCategory extends Component {
  state = {
    selectedKeys: [],
    visible: false, // 新增类别显隐
    updateVisible: false, // 修改类别显隐
    categoryData: [],
    isSelect: true,
    initialValue: {
      id: null,
      name: null,
      pid: null,
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/categoryinf',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.props.product) {
      const categoryData = [nextProps.product.categoryData];
      this.setState({
        categoryData,
      });
    }
  }

  /**
   * 获取选中的树节点的ID
   */

  onSelect = selectedKeys => {
    if (selectedKeys.length) {
      this.setState({
        isSelect: false,
      });
    } else {
      this.setState({
        isSelect: true,
      });
    }
    this.setState({ selectedKeys });
  };

  /**
   * 点击新增类别按钮
   */

  addCategory = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * 新增类别返回
   */

  addCancel = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * 保存新增类别
   */
  saveCategory = fields => {
    this.props.dispatch({
      type: 'product/categoryadd',
      payload: fields,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            visible: false,
          });
          this.category.resetForm();
          this.props.dispatch({
            type: 'product/categoryinf',
          });
        }
      },
    });
  };

  /**
   * 点击更新类别按钮
   */

  updateCategory = () => {
    const { selectedKeys } = this.state;
    const id = Number(selectedKeys.toString());
    this.props.dispatch({
      type: 'product/categoryinfList',
      payload: {
        id,
      },
      callback: res => {
        if (res.errcode) {
          message.error('暂时好像出错了!请稍后重试!');
        } else {
          this.setState(
            {
              initialValue: res.data,
            },
            () => {
              if (res.data.pid === 0) {
                message.error('不能修改根节点');
                return;
              }
              this.setState({
                updateVisible: true,
              });
            }
          );
        }
      },
    });
  };

  /**
   * 保存更新类别
   */
  update = fieldsValue => {
    this.props.dispatch({
      type: 'product/categoryupdate',
      payload: fieldsValue,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            updateVisible: false,
          });
          this.props.dispatch({
            type: 'product/categoryinf',
          });
        }
      },
    });
    this.category.resetForm();
  };

  /**
   * 更新类别返回
   */
  updateCancel = () => {
    this.setState({
      updateVisible: false,
    });
    this.category.resetForm();
  };

  // 点击删除类别按钮
  delCategory = () => {
    const { selectedKeys } = this.state;
    const id = Number(selectedKeys.toString());
    const that = this;
    confirm({
      title: '确定要删除此类别?',
      okText: '确定',
      okType: 'danger',
      cancelText: '返回',
      onOk() {
        that.delConfirm(id);
      },
      onCancel() {},
    });
  };

  // 确定删除（删除类别请求）
  delConfirm = id => {
    this.props.dispatch({
      type: 'product/categorydel',
      payload: {
        id,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.props.dispatch({
            type: 'product/categoryinf',
          });
        }
      },
    });
  };

  /**
   * 渲染树子节点
   */
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode className={styles.treenodestyles} title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} />;
    });
  };

  render() {
    const { categoryData } = this.state;

    return (
      <Card className={commonStyle.rowBackground}>
        <Row type="flex" justify="start" gutter={18}>
          <Col sm={24} md={4}>
            <Button type="primary" onClick={() => this.addCategory()} style={{ margin: '8px' }}>
              新增类别
            </Button>
            <Category
              title="新增类别"
              onRef={ref => {
                this.category = ref;
              }} // 可以使用自组件方法
              visible={this.state.visible} // 控制显隐
              cancel={this.addCancel} // 返回
              treeData={categoryData}
              dataInfo={this.saveCategory}
            />
            <Button
              onClick={() => this.updateCategory()}
              disabled={this.state.isSelect}
              style={{ margin: '8px' }}
            >
              修改类别
            </Button>
            <Category
              title="修改类别"
              onRef={ref => {
                this.category = ref;
              }} // 可以使用自组件方法
              visible={this.state.updateVisible} // 控制显隐
              cancel={this.updateCancel} // 返回
              treeData={categoryData}
              dataInfo={this.update}
              initialValue={this.state.initialValue}
            />
            <Button
              type="danger"
              onClick={() => this.delCategory()}
              disabled={this.state.isSelect}
              style={{ margin: '8px' }}
            >
              删除类别
            </Button>
          </Col>
          <Col sm={24} md={18}>
            <Tree onSelect={this.onSelect} selectedKeys={this.state.selectedKeys} showLine={true}>
              {this.renderTreeNodes(categoryData)}
            </Tree>
          </Col>
        </Row>
      </Card>
    );
  }
}
export default ProductCategory