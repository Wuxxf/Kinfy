import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Divider,
    Modal,
    Form,
    Input,
    Select,
    Row,
    Col,
    Upload,
    Icon,
  } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@connect()
@Form.create()
class EmployeeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      roleData:[], // 角色权限
      previewVisible: false,
      previewImage: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.roleData !== this.props.roleData) {
        this.setState({
          roleData: nextProps.roleData,
        });
    }
    if (nextProps.initialValue !== this.props.initialValue) {
      if(nextProps.initialValue.img_path){
        this.setState({
          fileList: [{
              uid: '-1',
              name: 'xxx.png',
              status: 'done',
              url: nextProps.initialValue.img_path,
            }],
        });
      }else{
        this.setState({
          fileList:[],
        })
      }
    }
  }

  render() {
    const { title,visible, form, onOk, onCancel } =this.props;
    let {initialValue} = this.props;
    const { previewVisible, previewImage , roleData } = this.state;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        onOk(fieldsValue);
      });
    };

    if(!initialValue){
        initialValue= {}
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
        onChange:({ fileList }) => this.setState({ fileList }),
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
        fileList: this.state.fileList,
      };

    const uploadButton = (
      <div>
        <Icon type="plus" style={{ fontSize: 22 }} />
        <div>选择员工头像</div>
      </div>
    );

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={okHandle}
      destroyOnClose={this.props.destroyOnClose}
      onCancel={() =>onCancel()}
      width={800}
    >
      <Row gutter={18}>
        <FormItem style={{margin:0}}>
          {form.getFieldDecorator('id', {
            initialValue:initialValue.id?initialValue.id:undefined,
        })(<span />)}
        </FormItem>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="员工名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入员工名称' }],
              initialValue:initialValue.name?initialValue.name:undefined,
            })(<Input placeholder="请输入员工名称" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="联系电话">
            {form.getFieldDecorator('mobile_phone', {
              rules: [
                { required: true, message: '请设置联系电话' },
                {
                  pattern: /^1\d{10}$/,
                  message: '请输入正确的手机号码！',
                },
              ],
              initialValue:initialValue.mobile_phone?initialValue.mobile_phone:undefined,
            })(<Input placeholder="请设置门店电话" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="邮箱地址">
            {form.getFieldDecorator('email', {
              rules:[{
                type: 'email',
                message: '邮箱地址格式错误！',
              }],
              initialValue:initialValue.email?initialValue.email:undefined,
            })(<Input placeholder="请输入邮箱地址" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="角色权限">
            {form.getFieldDecorator('role_id', {
              initialValue:initialValue.role_id?initialValue.role_id:undefined,
            })(
              <Select style={{ width: '100%' }} placeholder="请选择角色权限">
                {roleData.map(id => {
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
        <Divider orientation="left">其他信息</Divider>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="是否在职">
            {form.getFieldDecorator('state', {
                initialValue:initialValue.state?initialValue.state:1,
                })(
                  <Select style={{ width: '100%' }}>
                    <Option key={1} value={1}>在职</Option>
                    <Option key={0} value={0}>离职</Option>
                  </Select>
                )}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="可否登录">
            {form.getFieldDecorator('is_login', {
                initialValue:initialValue.is_login?initialValue.is_login:0,
                })(
                  <Select style={{ width: '100%' }}>
                    <Option key={1} value={1}>允许</Option>
                    <Option key={0} value={0}>禁止</Option>
                  </Select>
                )}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="员工头像">
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
                {this.state.fileList.length > 0 ? null : uploadButton}
              </Upload>
            )}
          </FormItem>
        </Col>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="无法显示" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Row>

    </Modal>
  );
  }
}

export default EmployeeModal
