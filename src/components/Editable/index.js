import React, { Component } from 'react';
import {
  Table, Popconfirm,
} from 'antd';
import EditableFormRow from './EditableTable';
// import EditableContext from './EditableContext';
import EditableCell from './EditableCell';
import styles from './index.less';

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.columns = props.columns;
    this.state = {
      dataSource: props.dataSource,
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
       dataSource: nextProps.dataSource,
    })
  }

  handleDelete = (id) => {
    const data = this.state.dataSource;
    const dataSource = [...data];
    this.setState({ dataSource: dataSource.filter(item => item.id !== id) });
  }


  handleSave = (row) => {
    const { dataSource } = this.state;
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => styles['editable-row']}
          bordered
          dataSource={dataSource}
          columns={columns}
          rowKey={record => record.id}
        />
      </div>
    );
  }
}

export default EditableTable
