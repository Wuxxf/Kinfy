import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Input, TreeSelect } from 'antd';

const ssdataSource = [
  {
    key: 1,
    name: '胡彦斌',
    danjia: 32,
    num: 2,
    address: '西湖区湖底公园1号',
  },
  {
    key: 2,
    name: '胡彦祖',
    danjia: 42,
    address: '西湖区湖底公园1号',
    num: 2,
  },
];

const treeData = [
  {
    label: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        label: 'Child Node1',
        value: '0-0-1',
        key: '0-0-1',
      },
      {
        label: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    label: 'Node2',
    value: '0-1',
    key: '0-1',
  },
];
const TreeNode = TreeSelect.TreeNode;
@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
export default class EmployeeMandanjiament extends Component {
  state = {
    dataSource: ssdataSource,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/storeind',
      callback: () => {
        dispatch({
          type: 'store/storeinf',
        });
      },
    });
  }
  onChange = value => {
    console.log(value);
    this.setState({ value });
  };
  changeInputJINER = e => {
    const a = this.state.dataSource;
    for (let i = 0; i < a.length; i++) {
      if (Number(e.target.id) === a[i].key) {
        a[i].danjia = e.target.value;
      }
    }
    this.setState({
      dataSource: a,
    });
  };
  changeInput = e => {
    const a = this.state.dataSource;
    for (let i = 0; i < a.length; i++) {
      if (Number(e.target.id) === a[i].key) {
        a[i].num = e.target.value;
      }
    }
    this.setState({
      dataSource: a,
    });
  };
  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '单价',
        dataIndex: 'danjia',
        key: 'danjia',
        render: (text, record) => (
          <Input
            defaultValue={record.danjia}
            id={record.key}
            style={{ width: 50 }}
            onChange={this.changeInputJINER}
          />
        ),
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        render: (text, record) => (
          <Input
            defaultValue={record.num}
            id={record.key}
            style={{ width: 50 }}
            onChange={this.changeInput}
          />
        ),
      },
      {
        title: '金额',
        dataIndex: 'result',
        key: 'result',
        render: (text, record) => {
          if (record.num === '') return;
          return record.num * record.danjia;
        },
      },
    ];

    return (
      <div>
        <Card>
          <Table dataSource={this.state.dataSource} columns={columns} />
        </Card>
      </div>
    );
  }
}
