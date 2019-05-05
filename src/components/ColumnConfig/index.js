import React, { Component } from 'react';
import {
  Icon,
  Form,
  Modal,
  Table,
  Row,
  Col,
  Button,
  message,
  Popover,
  Popconfirm,
} from 'antd';

import PopoverContent from './PopoverContent';

@Form.create()
class ColumnConfig extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible:false,
      dataSource:[],
      selectedRowKeys: [],
      selectedRows:[],
      isSelect:true,  // true 按钮禁用
    }
  }



  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource:nextProps.columns,
    });
    // console.log(nextProps.columns)
  }

  onSelectedRowKeysChange = (selectedRowKeys,selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows ,
      isSelect:false,
    });
  }

  onRef = (ref) =>{
    this.child = ref
  }

  // 控制显示隐藏
  onchangeVisble = (record) =>{
    let tmp = record;
    if(!record.length) { tmp = [record] }
    const data =  this.state.dataSource;
    const l = data.length
    let count = l ;
    for (let i = 0; i < l; i++) {
      if(!data[i].visible)
        count--;
    }

    for (let i = 0; i < l; i++) {
      if(tmp[0].dataIndex===data[i].dataIndex){
        if(tmp[0].visible){
          if(count<=this.props.minCol){
            message.warning(`至少显示${this.props.minCol}列`)
            return;
          }
          data[i].visible = false
          this.setState({selectedRows:[data[i]]})
        }else{
          data[i].visible = true
          this.setState({selectedRows:[data[i]]})
        }
      }

    }


    this.setState({
      dataSource:data,

    })

    this.props.callback(data)
  }

  // 显示Modal
  setting = () =>{
    this.setState({
      visible:true,
    })
  }

  // 置顶
  setTop = (selectedRows, dataSource) =>{
    let index = 0 ;
    for(let i = 0 ; i<dataSource.length;i++){
      if (selectedRows[0].key===dataSource[i].key)  index = i;
    }

    if(!index) {message.warning('已置顶');return;}
    const data  = dataSource
    const tmp = data.splice(0,1,data[index])[0]
    data[index] = tmp

    this.setState({
      dataSource:data,
    })

    this.props.callback(data)


  }

  // 置底
  setDown = (selectedRows, dataSource) =>{
    let index = 0 ;
    for(let i = 0 ; i<dataSource.length;i++){
      if (selectedRows[0].key===dataSource[i].key)  index = i;
    }
    if(index+1===dataSource.length) {message.warning('已到底');return;}
    const data  = dataSource
    const tmp = data.splice(dataSource.length-1,1,data[index])[0]
    data[index] = tmp

    this.setState({
      dataSource:data,
    })

    this.props.callback(data)

  }

  // 上移
  moveUp = (selectedRows, dataSource) =>{
    let index = 0 ;
    for(let i = 0 ; i<dataSource.length;i++){
      if (selectedRows[0].key===dataSource[i].key)  index = i;
    }

    if(!index) {message.warning('已置顶');return;}
    const data  = dataSource
    const tmp = data.splice(index-1,1,data[index])[0]
    data[index] = tmp

    this.setState({
      dataSource:data,
    })

    this.props.callback(data)

  }

  // 下移
  moveDown = (selectedRows, dataSource) =>{
    let index = 0 ;
    for(let i = 0 ; i<dataSource.length;i++){
      if (selectedRows[0].key===dataSource[i].key)  index = i;
    }
    if(index+1===dataSource.length) {message.warning('已到底');return;}
    const data  = dataSource
    const tmp = data.splice(index+1,1,data[index])[0]
    data[index] = tmp

    this.setState({
      dataSource:data,
    })

    this.props.callback(data)

  }

  // 点击行选择
  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
      this.setState({
        isSelect:true,
      })
    }
    else {
      selectedRowKeys.push(record.key);
      this.setState({
        isSelect:false,
      })
      if(selectedRowKeys.length>1){
        selectedRowKeys.splice(0,1)
      }
    }
    this.setState({
      selectedRowKeys,
      selectedRows:[record],
    });
  }

  // 返回
  handleCancel = () =>{
    this.setState({
        visible:false,
    })
  }

  // 气泡显示隐藏
  handleVisibleChange = (popoverVisible) => {
    this.setState({ popoverVisible });
    if(!popoverVisible){
      this.child.resetForm();
    }
  }

  // 保存新名称
  saveNewName = (values) =>{
    const { dataSource ,  selectedRows} = this.state;
    for (let i = 0; i < dataSource.length; i++) {
      if(dataSource[i].title === selectedRows[0].title){
        dataSource[i].title = values.title
      }
    }
    this.setState({
      dataSource,
      popoverVisible:false,
    })

    this.props.callback(dataSource)
  }

  // 还原默认值
  defaults = () =>{
    const { defaultColumns } = this.props;
    this.props.callback(defaultColumns)
  }



  render() {
    const { selectedRowKeys,selectedRows ,dataSource} = this.state;
    let count = 0;  //  鼠标点击次数（区别单双击)
    const rowSelection = {
      type:'radio',
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };

    const columns = [
      {
        title: '列名',
        dataIndex: 'defaultTitile',
        key: 'defaultTitile',
        align: 'center',
      },{
        title: '显示名称',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },{
        title: '显示状态',
        dataIndex: 'visible',
        key: 'visible',
        align: 'center',
        render:(text)=>{
          if(text) return <Icon type="check-circle" style={{color:"#52c41a"}} theme="outlined" />
          else return <Icon type="close-circle" style={{color:"#f5222d"}} theme="outlined" />
        },
    }];

    return (
      <span>
        <Icon type="setting" style={{ cursor: 'pointer', fontSize: 24, color: '#08c' }} onClick={() => this.setting()} />
        <Modal
          title="列配置"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width={800}
          footer={null}
          style={{userSelect:'none'}}
        >
          <Row gutter={18}>
            <Col sm={24} md={16} lg={17} xl={19}>
              <Table
                dataSource={dataSource}
                rowSelection={rowSelection}
                columns={columns}
                bordered
                pagination={false}
                onRow={(record) => {
                  return {
                      onClick: () => {
                        count += 1;
                        setTimeout(() => {
                          if (count === 1) {
                            this.selectRow(record);
                          } else if (count === 2) {
                            this.onchangeVisble(record)
                          }
                          count = 0;
                        }, 250);
                      },
                  };
                }}
              />
            </Col>
            <Col sm={24} md={8} lg={7} xl={5}>
              <Button
                style={{margin:'0 0 2px 0 '}}
                onClick={()=>this.moveUp(selectedRows,dataSource)}
                disabled={this.state.isSelect}
                block
              >
                上移
              </Button>
              <Button
                style={{margin:'2px 0 2px 0 '}}
                onClick={()=>this.moveDown(selectedRows,dataSource)}
                disabled={this.state.isSelect}
                block
              >
                下移
              </Button>
              <Button
                style={{margin:'2px 0 2px 0 '}}
                onClick={()=>this.setTop(selectedRows,dataSource)}
                disabled={this.state.isSelect}
                block
              >
                置顶
              </Button>
              <Button
                style={{margin:'2px 0 2px 0 '}}
                onClick={()=>this.setDown(selectedRows,dataSource)}
                disabled={this.state.isSelect}
                block
              >
                置底
              </Button>
              <Button
                style={{margin:'2px 0 2px 0 '}}
                onClick={()=>this.onchangeVisble(selectedRows)}
                disabled={this.state.isSelect}
                block
              >
                切换显示
              </Button>
              <Popover
                content={<PopoverContent onRef={this.onRef} initialValue={selectedRows} saveNewName={this.saveNewName} />}
                placement="leftTop"
                title="修改列显示名称"
                trigger="click"
                visible={this.state.popoverVisible}
                onVisibleChange={this.handleVisibleChange}
              >
                <Button
                  style={{margin:'2px 0 2px 0 '}}
                  disabled={this.state.isSelect}
                  block
                >
                  修改名称
                </Button>
              </Popover>
              <Popconfirm placement="leftTop" title='您确定要还原默认设置吗？' onConfirm={()=>this.defaults()} okText="确定" cancelText="取消">
                <Button style={{margin:'2px 0 2px 0 '}} block>还原默认设置</Button>
              </Popconfirm>
              <Button style={{margin:'20px 0 2px 0 '}} onClick={()=>this.handleCancel()} block>关闭</Button>
            </Col>
          </Row>

        </Modal>
      </span>
    );
  }
}

export default ColumnConfig

