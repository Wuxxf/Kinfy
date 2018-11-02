import React from 'react';
import {Row,Col, Modal, Input } from 'antd';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';


export default class BulletinAdd extends React.Component {
  state = {
    value: '',
  };

  modules =  {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean'],
    ],
  }

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
  ]

  handleChange = (value) => {
    this.setState({
      value,
    })
  };

  prompt = () => {
    const {title , value} = this.state;
    const payload = {
        title,
        content:value,
    }
    /* eslint-disable */
    this.props.onOk(payload)
    
    this.setState({
      value:'',
      title:'',
    })
  };

  titleChange =(e)=>{
    this.setState({
      title: e.target.value,
    })
  }

  render() {
    const { visible , onCancel } = this.props;
    const { value } = this.state;
    return (
      <Modal
        title="发布公告"
        visible={visible}
        onOk={this.prompt}
        okText='发布'
        onCancel={onCancel}
        destroyOnClose
        maskClosable={false}
        width={800}
      >
        <Row>
          <Col span={24} style={{marginBottom:10}}>
            <Col sm={2} md={2} lg={2} xl={2}><span style={{display:'inline-block',lineHeight:'32px'}}>发送目标</span></Col>
            <Col sm={12} md={5} lg={5} xl={5}><Input value='本店' disabled /></Col>     
          </Col> 
          <Col span={24} style={{marginBottom:10}}>
            <Col sm={2} md={2} lg={2} xl={2}><span style={{display:'inline-block',lineHeight:'32px'}}>公告主题</span></Col>
            <Col sm={22} md={22} lg={22} xl={22}> <Input onChange={(e)=>this.titleChange(e)} /></Col>  
          </Col> 
          <Col span={24}>
            <ReactQuill
              theme="snow"
              value={value} 
              onChange={this.handleChange} 
              modules={this.modules}
              formats={this.formats}
            />
          </Col> 
        </Row>
      </Modal>
    );
  }
}