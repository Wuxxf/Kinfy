import React, { Component } from 'react';
import {
  Checkbox,
  Button,
  Input,
  Form,
} from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

class Search extends Component {
  constructor(props){
    super(props)
    this.state={
      checked:false,
    }
  }

  // 提交
  handleSubmit = () =>{
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.callback(fieldsValue)
    });
  }

  // 重置
  reset = () =>{
    const { form } = this.props;
    this.setState({
      checked:false,
    })
    form.resetFields();
    this.props.reset();
  }

  onChange = (e) =>{
    this.setState({
      checked:e.target.checked
    })
  }

  render() {
    const { form } = this.props;
    const { checked } = this.state;
    return (
      <Form
        onSubmit={this.handleSubmit}
        className={styles['new-form-item']}
        hideRequiredMark
        layout='inline'
      >
        <FormItem label="供应商名称">
          {form.getFieldDecorator('name')(
            <Input placeholder="搜索供应商名称" />
          )}
        </FormItem>
        <FormItem label="选择显示">
          {form.getFieldDecorator('arrears')(
            <Checkbox style={{width:'100%'}} onChange={this.onChange} checked={checked}>隐藏零欠款供应商</Checkbox>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button type="primary" onClick={this.reset}>
            重置
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Search)
