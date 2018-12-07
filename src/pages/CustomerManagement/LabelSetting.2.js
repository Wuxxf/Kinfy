import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Table, Input, Button, Divider, Popconfirm, message, Modal } from 'antd';
import commonStyle from '../../global.less'; // 公共样式

const FormItem = Form.Item;

// 标签错误
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
// Modal
const CreateUpdateEmpForm = Form.create()(props => {
  const { updatevisible, form, update, handleCancel, updateData } = props;
  // 点击确定
  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      update(fieldsValue, updateData.id);
    });
  };
  return (
    <Modal title="编辑标签" visible={updatevisible} onOk={handleOk} onCancel={() => handleCancel()}>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签名称">
        {form.getFieldDecorator('updatename', {
          rules: [{ required: true, message: '请输入标签名称' }],
          initialValue: updateData.name,
        })(<Input placeholder="请输入标签名称" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
}))
@Form.create()
class LabelSetting extends Component {
  state = {
    updatevisible: false,
    updateData: {},
  };

  componentDidMount() {
    // 刚加载页面时 禁用按钮
    this.props.form.validateFields();
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/customerLabelinf',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customer !== this.props.customer) {
      this.setState({
        labelData: nextProps.customer.labelData,
      });
    }
  }

  // 点击添加按钮
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handleAdd(fieldsValue);
    });
  };

  // 添加标签请求
  handleAdd = fields => {
    const { labelData } = this.props.customer;
    this.props.dispatch({
      type: 'customer/addLabel',
      payload: {
        name: fields.name,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          labelData.unshift(res.data);
        }
      },
    });
  };

  // 删除标签
  handleDel = record => {
    const { labelData } = this.props.customer;
    this.props.dispatch({
      type: 'customer/delLabel',
      payload: {
        id: record.id,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          // 从数组中删除标签。。。
          for (let i = 0; i < labelData.length; i += 1) {
            if (labelData[i] === record) labelData.splice(i, 1); // 删除
          }
        }
      },
    });
  };

  // 点击编辑按钮
  handleupdate = record => {
    this.setState({
      updatevisible: true,
      updateData: record,
    });
  };

  // 修改标签请求
  updateLabel = (fields, dataId) => {
    const { labelData } = this.props.customer;
    const payloadData = {
      id: dataId,
      name: fields.updatename,
    };
    this.props.dispatch({
      type: 'customer/updateLabel',
      payload: payloadData,
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success('更新成功');
          this.setState({
            updatevisible: false,
            updateData: {},
          });
          for (let i = 0; i < labelData.length; i += 1) {
            if (labelData[i].id === payloadData.id) {
              labelData[i] = payloadData;
            }
          }
        }
      },
    });
  };

  handleCancel = () => {
    this.setState({
      updatevisible: false,
      updateData: {},
    });
    this.props.form.resetFields();
  };

  render() {
    const { updatevisible, updateData, labelData } = this.state;

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const labeColumns = [
      {
        title: '标签名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        render: record => {
          return (
            <span>
              <a onClick={() => this.handleupdate(record)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                <a style={{ color: '#FF4500' }}>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const nameError = isFieldTouched('name') && getFieldError('name');

    const parentMethods = {
      update: this.updateLabel,
      handleCancel: this.handleCancel,
    };
    return (
      <div className={commonStyle['rowBackground-div']}>
        <Form layout="inline" onSubmit={() => this.handleSubmit}>
          <FormItem
            validateStatus={nameError ? 'error' : ''}
            help={nameError || ''}
            label="标签名称"
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入标签!' }],
            })(<Input placeholder="请输入标签" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              添加
            </Button>
          </FormItem>
        </Form>
        <br />
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Table
              bordered
              locale={{ emptyText: '暂无标签' }}
              rowKey={record => record.id}
              columns={labeColumns}
              dataSource={labelData}
            />
          </Col>
        </Row>
        <CreateUpdateEmpForm
          {...parentMethods}
          updatevisible={updatevisible}
          updateData={updateData}
        />
      </div>
    );
  }
}
export default LabelSetting
