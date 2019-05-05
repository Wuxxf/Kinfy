import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Icon,
  message,
} from 'antd';

import styles from './Login.less';
// import commonStyle from '../../commonStyle.less'; // 公共样式


const FormItem = Form.Item;
const { Option } = Select;


@connect(({ login,store }) => ({
  login,
  store,
}))
@Form.create()
class CreateStore extends Component {
  constructor(props){
    super(props)
    this.state={
      industryData:[],
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/storeind',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.store !== this.props.store) {
      this.setState({
        industryData: nextProps.store.IndustryData,
      });
    }
  }

  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'store/add',
        payload: fieldsValue,
        callback: res => {
          if (res.errcode) {
            message.error(res.msg);
          } else {
            message.success(res.msg);
            this.props.dispatch({
              type:'login/enterStore',
              payload:res.data.id,
            })
          }
        },
      });

    });
  };

  render() {
    const { form }=this.props
    return (
      <div className={styles.main}>
        <h3>创建门店</h3><br />
        <Row gutter={18}>
          <FormItem style={{margin:0}}>
            {form.getFieldDecorator('id', {
          })(<span />)}
          </FormItem>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <FormItem>
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入门店名称' }],
              })(
                <Input
                  size='large'
                  placeholder="请输入门店名称"
                  prefix={<Icon type="appstore" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              )}
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <FormItem>
              {form.getFieldDecorator('operation_mode', {
              })(
                <Select style={{ width: '100%' }} placeholder="请选择经营方式" size='large'>
                  <Option key={1} value={1}>零售</Option>
                  <Option key={2} value={2}>批发</Option>
                  <Option key={3} value={3}>零售兼批发</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <FormItem>
              {form.getFieldDecorator('industry_id', {
                rules: [{ required: true, message: '请选择所属行业' }],

              })(
                <Select style={{ width: '100%' }} size='large' placeholder="请选择行业">
                  {this.state.industryData.map(id => {
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
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <FormItem>
              {form.getFieldDecorator('mobile_phone', {
                rules: [
                  { required: true, message: '请设置联系电话' },
                  {
                    pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
                    message: '请输入正确的手机号码！',
                  },
                ],
              })(<Input size='large' placeholder="请设置门店电话" />)}
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <FormItem>
              {form.getFieldDecorator('QQ', {
                rules: [
                  {
                    pattern: /^[0-9]*$/,
                    message: '请输入数字',
                  },
                ],
              })(<Input size='large' placeholder="请设置QQ号" />)}
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <FormItem>
              {form.getFieldDecorator('store_address', {
              })(<Input size='large' placeholder="请设置门店地址" />)}
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Button onClick={this.okHandle} type='primary' block>确定</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
export default CreateStore
