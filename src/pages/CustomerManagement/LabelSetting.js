import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Input, Button, Divider, Popconfirm, message, Modal } from 'antd';
// import Editable from '@/components/Editable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import commonStyle from '../../global.less'; // 公共样式

const FormItem = Form.Item;


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

@connect(({ customer }) => ({
  customer,
}))
@Form.create()
class LabelSetting extends Component {
  index = 0; // 临时ID

  cacheOriginData = {}; // 临时数据 取消编辑用的

  isNewRow = false;

  state = {
    loading:false,
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
  handleSubmit = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      this.handleAdd(fieldsValue);
    });
  };

  // 添加标签请求
  handleAdd = fields => {
    console.log(fields)

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
        this.setState({
          loading: false,
        });
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
    const { id } = record;
    const { labelData } = this.state;

    if (!this.state.labelData) {
      this.setState({
        labelData,
      });
    }

    let newData = labelData.map(item => ({ ...item }));
    if (this.state.labelData) {
      newData = this.state.labelData.map(item => ({ ...item }));
    }
    const target = this.getRowById(id, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[id] = { ...target };
      }
      target.editable = !target.editable;

      this.setState({ labelData: newData });
    }

    // this.setState({
    //   updatevisible: true,
    //   updateData: record,
    // });
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


  // 点击取消
  cancel(e, id) {
    const { labelData }=this.state;
    this.clickedCancel = true;
    e.preventDefault();
    const newData = labelData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);
    if (this.cacheOriginData[id]) {
      Object.assign(target, this.cacheOriginData[id]);
      delete target.editable;
      delete this.cacheOriginData[id];
    }
    this.setState({ labelData: newData });
    this.clickedCancel = false;
  }




  newMember = () => {
    if (this.isNewRow) return;
    this.isNewRow = true  ;
    const { labelData } = this.state;

    if (!this.state.labelData) {
      this.setState({
        labelData,
      });
    }
    let newData = labelData.map(item => ({ ...item }));
    if (this.state.labelData) {
      newData = this.state.labelData.map(item => ({ ...item }));
    }
    newData.push({
      id: `NEW_TEMP_ID_${this.index}`,
      name: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;

    this.setState({ labelData: newData });
  };

  getRowById(id, newData) {
    return (newData || this.state.labelData).filter(item => item.id === id)[0];
  }

  // INPUT 输入
  handleFieldChange(e, fieldName, id) {

    if(e.target.value.length > 10){
      message.warning('标签名称小于10字符')
      return;
    }

    const newData = this.state.labelData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);

    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ labelData: newData });
    }
  }

  // 删除新增的一行
  removeNew = id => {
    const { labelData } =this.state;
    this.isNewRow = false;
    const newData = labelData.filter(item => item.id !== id);
    this.setState({ labelData: newData });
  };

    // 添加
  saveRowAdd(e, id) {
    const newData = this.state.labelData.map(item => ({ ...item }));

    // const { labelData } = this.props.customer;
    // this.props.dispatch({
    //   type: 'customer/addLabel',
    //   payload: {
    //     name: fields.name,
    //   },
    //   callback: res => {
    //     if (res.errcode) {
    //       message.error(res.msg);
    //     } else {
    //       message.success(res.msg);
    //       labelData.unshift(res.data);
    //     }
    //   },
    // });

    const target = this.getRowById(id, newData);

    e.persist();
    if (!target.name) {
      const { input } = this.inputRef;

      message.error('请填写完整成员信息。');

      input.focus();

    } else {
      this.props.dispatch({
        type: 'customer/addLabel',
        payload: {
          name: target.name,
        },
        callback: res => {
          if (res.errcode) {
            message.error(res.msg);
          } else {
            const { labelData } = this.state;
            message.success(res.msg);
            this.isNewRow = false;
            labelData.push(res.data)
            this.setState({
              labelData,
            });
          }
        },
      });
    }
  }

    // 编辑保存
  saveRowUpdate(e, id) {
    e.persist();
    const newData = this.state.labelData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);
    if (!target.name) {
      message.error('请填写完整成员信息。');
      e.target.focus();
    } else {
      this.props.dispatch({
        type: 'customer/addLabel',
        payload: {
          id: target.id,
          name: target.name,
        },
        callback: res => {
          if (res.errcode) {
            message.error(res.msg);
          } else {
            message.success(res.msg);
            delete target.editable;
            this.setState({
              labelData: newData,
            });
          }
        },
      });
    }
  }


  render() {
    const { updatevisible, updateData, labelData } = this.state;

    const labeColumns = [
      {
        title: '标签名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                ref={(input) => { this.inputRef = input; }}
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.id)}
                placeholder="请输入标签名称"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        width:'220px',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRowAdd(e, record.id)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除新增行？" onConfirm={() => this.removeNew(record.id)}>
                    <a style={{ color: '#FF4500' }}>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRowUpdate(e, record.id)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.id)}>取消</a>
              </span>
            );
          }
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



    const parentMethods = {
      update: this.updateLabel,
      handleCancel: this.handleCancel,
    };
    return (
      <PageHeaderWrapper
        title="标签设置"
        // action={<Button type='primary'>添加标签</Button>}
      >
        <div className={commonStyle['rowBackground-div']}>
          <Table
            bordered
            locale={{ emptyText: '暂无标签' }}
            rowKey={record => record.id}
            columns={labeColumns}
            dataSource={labelData}
            pagination={false}
          />
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            添加客户标签
          </Button>

          <CreateUpdateEmpForm
            {...parentMethods}
            updatevisible={updatevisible}
            updateData={updateData}
          />
          {/* <Editable columns={labeColumns} dataSource={labelData} /> */}
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default LabelSetting
