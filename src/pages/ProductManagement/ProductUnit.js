import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, message, Popconfirm, Divider, Card } from 'antd';
import styles from './CauseOfLoss.less';

@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class ProductUnit extends Component {
  // 新增一行
  flag = 1;

  index = 0;  // 临时Id

  cacheOriginData = {};// 临时数据 取消编辑用的

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/unitsinf',
    });
  }

  getRowById(id, newData) {
    return (newData || this.state.unitsData).filter(item => item.id === id)[0];
  }


  // 点击编辑
  toggleEditable = (e, id) => {
    e.preventDefault();
    const propsData = this.props.product.unitsData;
    if (!this.state.unitsData) {
      this.setState({
        unitsData: propsData,
      });
    }
    let newData = propsData.map(item => ({ ...item }));
    if (this.state.unitsData) {
      newData = this.state.unitsData.map(item => ({ ...item }));
    }
    const target = this.getRowById(id, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[id] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ unitsData: newData });
    }
  };

  // 删除新增的一行
  removeNew = id => {
    const { unitsData } =this.state;
    this.flag = 1;
    const newData = unitsData.filter(item => item.id !== id);
    this.setState({ unitsData: newData });
  };

  newMember = () => {
    if (this.flag === 0) return;
    this.flag = 0;
    const propsData = this.props.product.unitsData;
    if (!this.state.unitsData) {
      this.setState({
        unitsData: propsData,
      });
    }
    let newData = propsData.map(item => ({ ...item }));
    if (this.state.unitsData) {
      newData = this.state.unitsData.map(item => ({ ...item }));
    }
    newData.push({
      id: `NEW_TEMP_ID_${this.index}`,
      name: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ unitsData: newData });
  };
    
  // 点击取消
  cancel(e, id) {
    const { unitsData }=this.state;
    this.clickedCancel = true;
    e.preventDefault();
    const newData = unitsData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);
    if (this.cacheOriginData[id]) {
      Object.assign(target, this.cacheOriginData[id]);
      delete target.editable;
      delete this.cacheOriginData[id];
    }
    this.setState({ unitsData: newData });
    this.clickedCancel = false;
  }

  // 点击删除
  remove(recordId) {
    const propsData = this.props.product.unitsData;
    const { unitsData }=this.state;
    if (!unitsData) {
      this.setState({
        unitsData: propsData,
      });
    }
    this.props.dispatch({
      type: 'product/unitsdel',
      payload: {
        id: recordId,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          const newData = unitsData.filter(item => item.id !== recordId);
          this.setState({ unitsData: newData });
        }
      },
    });
  }


  // INPUT 输入
  handleFieldChange(e, fieldName, id) {
    const newData = this.state.unitsData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);

    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ unitsData: newData });
    }
  }

  // 编辑保存
  saveRowUpdate(e, id) {
    e.persist();
    const newData = this.state.unitsData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);
    if (!target.name) {
      message.error('请填写完整成员信息。');
      e.target.focus();
    } else {
      this.props.dispatch({
        type: 'product/unitsupdate',
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
              unitsData: newData,
            });
          }
        },
      });
    }
  }

  // 添加
  saveRowAdd(e, id) {
    const newData = this.state.unitsData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);
    e.persist();
    if (!target.name) {
      message.error('请填写完整成员信息。');
      e.target.focus();
    } else {
      this.props.dispatch({
        type: 'product/unitsadd',
        payload: {
          name: target.name,
        },
        callback: res => {
          if (res.errcode) {
            message.error(res.msg);
          } else {
            message.success(res.msg);
            this.flag = 1;
            target.id = res.data.id;
            delete target.isNew;
            delete target.editable;
            this.setState({
              unitsData: newData,
            });
          }
        },
      });
    }
  }

  render() {
    const { product, loading } = this.props;
    const { unitsData } = product;
    const columnlength = !this.state.unitsData ? unitsData.length : this.state.unitsData.length;
    let cl = 0;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '15%',
        render: () => {
          if (columnlength === cl) return cl;
          return ++cl;
        },
      },
      {
        title: '货品单位',
        dataIndex: 'name',
        key: 'name',
        width: '70%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.id)}
                placeholder="货品单位"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
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
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeNew(record.id)}>
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
              <a onClick={e => this.toggleEditable(e, record.id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                <a style={{ color: '#FF4500' }}>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Card>
          <Table
            loading={loading}
            columns={columns}
            dataSource={!this.state.unitsData ? unitsData : this.state.unitsData}
            pagination={false}
            bordered={true}
            locale={{ emptyText: '暂无货品单位' }}
            rowClassName={record => {
              return record.editable ? styles.editable : '';
            }}
            rowKey={record => record.id}
          />
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            添加货品单位
          </Button>
        </Card>
      </Fragment>
    );
  }
}
export default ProductUnit