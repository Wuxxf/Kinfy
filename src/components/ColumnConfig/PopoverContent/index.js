import React, {Component} from 'react';
import {
    Form,
    Row,
    Button,
    Input,
  } from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class PopoverContent extends Component {
  componentDidMount() {
    this.props.onRef(this)
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.saveNewName(values)
        this.resetForm()
      }
    });
  }

  resetForm = ()=>{
    this.props.form.resetFields();
  }

  render() {
    const { form ,initialValue} = this.props;

    return(
      <Row> 
        <Form layout='inline' onSubmit={this.handleSubmit} >
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="新名称">
            {form.getFieldDecorator('title', {
              rules: [{ required: true, message: '名称不能为空' }],
            initialValue:initialValue[0].title,
          })(<Input placeholder="请输入新名称" />)}
          </FormItem>
          <FormItem>
            <Button type="primary"  htmlType="submit" >保存</Button>
          </FormItem>
        </Form>       
      </Row>
    );
  }
}
