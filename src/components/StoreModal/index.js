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
    Cascader,
    Upload,
    Icon,
    // TimePicker ,
  } from 'antd';
  import China from './China';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
export default class StoreModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      previewVisible: false,
      previewImage: '',
    };
  }

  componentWillReceiveProps(nextProps) {
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
    const { title,visible, form, onOk, onCancel, industryData } =this.props;
    let {initialValue} = this.props;
    const {  previewVisible, previewImage } = this.state;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        onOk(fieldsValue);
      });
    };
  
    const filter=(inputValue, path)=> {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

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
        <div>选择门店logo</div>
      </div>
    );

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={okHandle}
      onCancel={() => onCancel()}
      width={800}
      destroyOnClose={this.props.destroyOnClose}
    >
      <Row gutter={18}>
        <FormItem style={{margin:0}} >
          {form.getFieldDecorator('id', {
            initialValue:initialValue.id?initialValue.id:undefined,
        })(<span />)}
        </FormItem>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="门店名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入门店名称' }],
              initialValue:initialValue.name?initialValue.name:undefined,
            })(<Input placeholder="请输入门店名称" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="经营方式">
            {form.getFieldDecorator('operation_mode', {
              initialValue:initialValue.operation_mode?initialValue.operation_mode:1,
            })(
              <Select style={{ width: '100%' }}>
                <Option key={1} value={1}>零售</Option>
                <Option key={2} value={2}>批发</Option>
                <Option key={3} value={3}>零售兼批发</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="所属行业">
            {form.getFieldDecorator('industry_id', {
              rules: [{ required: true, message: '请选择所属行业' }],
              initialValue:initialValue.industry_id?initialValue.industry_id:undefined,
            })(
              <Select style={{ width: '100%' }} placeholder="请选择行业">
                {industryData.map(id => {
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
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="联系电话">
            {form.getFieldDecorator('mobile_phone', {
              rules: [
                { required: true, message: '请设置联系电话' },
                {
                  pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
                  message: '请输入正确的手机号码！',
                },
              ],
              initialValue:initialValue.mobile_phone?initialValue.mobile_phone:undefined,
            })(<Input placeholder="请设置门店电话" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="QQ">
            {form.getFieldDecorator('QQ', {
              rules: [
                {
                  pattern: /^[0-9]*$/,
                  message: '请输入数字',
                },
              ],
              initialValue:initialValue.QQ?initialValue.QQ:undefined,
            })(<Input placeholder="请设置QQ号" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="门店地址">
            {form.getFieldDecorator('store_address', {
              initialValue:initialValue.store_address?initialValue.store_address:undefined,
            })(<Input placeholder="请设置门店地址" />)}
          </FormItem>
        </Col>
        {/* <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="开始营业时间">
            {form.getFieldDecorator('open_time', {
              initialValue:initialValue.open_time?initialValue.open_time:undefined,
            })( <TimePicker style={{width:'100%'}}   />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="结束营业时间">
            {form.getFieldDecorator('close_time', {
              initialValue:initialValue.close_time?initialValue.close_time:undefined,
            })( <TimePicker style={{width:'100%'}}   />)}
          </FormItem>
        </Col> */}
        <Divider orientation="left">收货地址</Divider>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="联系电话">
            {form.getFieldDecorator('delivery_mobile', {
              rules: [
                {
                  pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
                  message: '请输入正确的手机号码！',
                },
              ],
                initialValue:initialValue.delivery_mobile?initialValue.delivery_mobile:undefined,
            })(<Input placeholder="请设置联系电话" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="联系人">
            {form.getFieldDecorator('delivery_man', {
              rules: [
              ],
              initialValue:initialValue.delivery_man?initialValue.delivery_man:undefined,
            })(<Input placeholder="请输入联系人" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="收货地址">
            {form.getFieldDecorator('china_address', {
              initialValue:initialValue.china_address?initialValue.china_address:undefined,
            })(
              <Cascader
                style={{width:'100%'}}
                options={China}
                placeholder="选择收货地址"
                showSearch={{ filter }}
              />
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} >
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="详细地址">
            {form.getFieldDecorator('delivery_address', {
              rules: [
              ],
              initialValue:initialValue.delivery_address?initialValue.delivery_address:undefined,
            })(<Input placeholder="请输入详细地址" />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="门店logo">
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
