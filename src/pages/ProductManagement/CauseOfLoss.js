import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, message, Popconfirm, Divider, Card } from 'antd';
import styles from './CauseOfLoss.less';

@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class CauseOfLoss extends Component {
  index = 0;
  
  cacheOriginData = {}; // 临时数据 取消编辑用的

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/causeoflossinf',
    });
  }

  getRowById(id, newData) {
    return (newData || this.state.causeOfLossData).filter(item => item.id === id)[0];
  }



  // 点击编辑

  toggleEditable = (e, id) => {
    e.preventDefault();
    const propsData = this.props.product.causeOfLossData;
    if (!this.state.causeOfLossData) {
      this.setState({
        causeOfLossData: propsData,
      });
    }
    let newData = propsData.map(item => ({ ...item }));
    if (this.state.causeOfLossData) {
      newData = this.state.causeOfLossData.map(item => ({ ...item }));
    }
    const target = this.getRowById(id, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[id] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ causeOfLossData: newData });
    }
  };


  // 删除新增的一行
  removeNew = id => {
    const {causeOfLossData }  = this.state;
    const newData = causeOfLossData.filter(item => item.id !== id);
    this.setState({ causeOfLossData: newData });
  };

  // 新增一行
  newMember = () => {
    const propsData = this.props.product.causeOfLossData;
    if (!this.state.causeOfLossData) {
      this.setState({
        causeOfLossData: propsData,
      });
    }
    let newData = propsData.map(item => ({ ...item }));
    if (this.state.causeOfLossData) {
      newData = this.state.causeOfLossData.map(item => ({ ...item }));
    }
    newData.unshift({
      id: `NEW_TEMP_ID_${this.index}`,
      reason: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ causeOfLossData: newData });
  };

  // 点击取消
  cancel(e, id) {
    const {causeOfLossData }  = this.state;
    this.clickedCancel = true;
    e.preventDefault();
    const newData = causeOfLossData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);
    if (this.cacheOriginData[id]) {
      Object.assign(target, this.cacheOriginData[id]);
      delete target.editable;
      delete this.cacheOriginData[id];
    }
    this.setState({ causeOfLossData: newData });
    this.clickedCancel = false;
  }

  // 点击删除
  remove(recordId) {
    const propsData = this.props.product.causeOfLossData;
    const {causeOfLossData }  = this.state;
    if (!causeOfLossData) {
      this.setState({
        causeOfLossData: propsData,
      });
    }
    this.props.dispatch({
      type: 'product/causeoflossdel',
      payload: {
        id: recordId,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          const newData = causeOfLossData.filter(item => item.id !== recordId);
          this.setState({ causeOfLossData: newData });
        }
      },
    });
  }

  // INPUT 输入
  handleFieldChange(e, fieldName, id) {
    const newData = this.state.causeOfLossData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);

    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ causeOfLossData: newData });
    }
  }

  // 编辑保存
  saveRowUpdate(e, id) {
    e.persist();
    const newData = this.state.causeOfLossData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);
    if (!target.reason) {
      message.error('请填写完整成员信息。');
      e.target.focus();
    } else {
      this.props.dispatch({
        type: 'product/causeoflossupdate',
        payload: {
          id: target.id,
          reason: target.reason,
        },
        callback: res => {
          if (res.errcode) {
            message.error(res.msg);
          } else {
            message.success(res.msg);
            delete target.editable;
            this.setState({
              causeOfLossData: newData,
            });
          }
        },
      });
    }
  }
  
  // 添加
  saveRowAdd(e, id) {
    const newData = this.state.causeOfLossData.map(item => ({ ...item }));
    const target = this.getRowById(id, newData);
    e.persist();
    if (!target.reason) {
      message.error('请填写完整成员信息。');
      e.target.focus();
    } else {
      this.props.dispatch({
        type: 'product/causeoflossadd',
        payload: {
          reason: target.reason,
        },
        callback: res => {
          if (res.errcode) {
            message.error(res.msg);
          } else {
            message.success(res.msg);
            target.id = res.data.id;
            delete target.isNew;
            delete target.editable;
            this.setState({
              causeOfLossData: newData,
            });
          }
        },
      });
    }
  }

  render() {
    const { product, loading } = this.props;
    const { causeOfLossData } = product;
    const columns = [
      {
        title: '报损原因',
        dataIndex: 'reason',
        key: 'reason',
        width: '70%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'reason', record.id)}
                placeholder="报损原因"
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
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            添加报损原因
          </Button>
          <Table
            loading={loading}
            columns={columns}
            dataSource={!this.state.causeOfLossData ? causeOfLossData : this.state.causeOfLossData}
            pagination={false}
            bordered={true}
            locale={{ emptyText: '暂无报损原因' }}
            rowClassName={record => {
              return record.editable ? styles.editable : '';
            }}
            rowKey={record => record.id}
          />
        </Card>
      </Fragment>
    );
  }
}
export default CauseOfLoss