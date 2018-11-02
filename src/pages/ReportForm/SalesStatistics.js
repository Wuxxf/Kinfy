import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Radio,
  DatePicker ,
  Button,
  Table,
  Card,
} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";

import TimeQuery from '@/components/TimeQuery';
import styles from  './index.less';
import commonStyle from '../../global.less'; // 公共样式

const {  RangePicker} = DatePicker;

const RadioGroup = Radio.Group;

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
class SalesStatistics extends Component {
  state ={
    queryValue:'day',
    mode: ['month', 'month'],
    value:[moment(),moment()],
    rangeDay:[moment(),moment()],
    radioValue:2,
  }

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

  componentWillReceiveProps(nextProps) {
    const { supplier } = this.props;
    if (nextProps.supplier !== supplier) {
      this.setState({
        // supplierData: nextProps.supplier.supplierData,
      });
    }
  }

  timeButton = (value) =>{
    console.log(value)
  }


  timeChange = (date, dateString)=>{
    this.setState({
      rangeDay:date,
      // radioValue:null,
    })
    console.log(date, dateString);

  }

  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ],
    });
  }

  queryChange = (e) =>{
    this.setState({
      queryValue:e.target.value,
    })
  }

  render() {
    const {value, mode, radioValue ,queryValue,rangeDay } = this.state;
    const dataSource = [{
      key: '1',
      date: '2018-10-21',
      pay: 32,
      count: '2',
    }, {
      key: '2',
      date: '2018-10-21',
      pay: 42,
      count: '4',
    }];
    
    const columns = [{
      title: '日期',
      align:'center',
      dataIndex: 'date',
      key: 'date',
    }, {
      title: '销售额',
      align:'center',
      dataIndex: 'pay',
      key: 'pay',
    }, {
      title: '销售笔数',
      dataIndex: 'count',
      align:'center',
      key: 'count',
    }];

    const data = [
      {
        month: "2018-01-01",
        acc: 84.0,
      },
      {
        month: "2018-02-01",
        acc: 14.9,
      },
      {
        month: "2018-03-01",
        acc: 17.0,
      },
      {
        month: "2018-04-01",
        acc: 20.2,
      },
      {
        month: "2018-05-01",
        acc: 55.6,
      },
      {
        month: "2018-06-01",
        acc: 86.7,
      },
      {
        month: "2018-07-01",
        acc: 30.6,
      },
      {
        month: "2018-08-01",
        acc: 63.2,
      },
      {
        month: "2018-09-01",
        acc: 24.6,
      },
      {
        month: "2018-10-01",
        acc: 14.0,
      },
      {
        month: "2018-11-01",
        acc: 9.4,
      },
      {
        month: "2018-12-01",
        acc: 6.3,
      },
    ];
    const cols = {
      month: {
        alias: "月份",
      },
      acc: {
        alias: "积累量",
      },
    };

    if (this.chart) {
      this.chart.forceFit();
    }

    return (
      <div>
        <Card className={commonStyle.rowBackground}>
          <TimeQuery 
            callback={this.timeButton}  // 传回时间
            defaultValue={radioValue}  // 选中的radio
          />
          <br />
          {
            queryValue==='day'
            ?<RangePicker onChange={this.timeChange} value={rangeDay}  />
            :(
              <RangePicker
                format="YYYY-MM"
                value={value}
                mode={mode}
                onPanelChange={this.handlePanelChange}
              />
            )
          }
          <RadioGroup onChange={this.queryChange} value={queryValue} style={{marginLeft:10}}>
            <Radio value='day'>按日查询</Radio>
            <Radio value='month'>按月查询</Radio>
          </RadioGroup>
          <Button type='primary'>查询</Button>
        </Card>
        <Card className={commonStyle.rowBackground}>
          <span className={styles.mainTitle}>
            <span style={{marginRight:10}}>销售总额：<span style={{color:'#1890ff'}}>￥{111}</span></span>
            <span>销售笔数：<span style={{color:'#1890ff'}}>{12}笔</span></span>
          </span>
          <Chart 
            height={400} 
            data={data} 
            scale={cols} 
            forceFit 
            onGetG2Instance={(chart) => {this.chart = chart;}} 
          >
            <Axis
              name="month"
              title={null}
              tickLine={null}
              line={{
                stroke: "#E6E6E6",
              }}
            />
            <Axis
              name="acc"
              line={false}
              tickLine={null}
              grid={null}
              title={null}
            />
            <Tooltip />
            <Geom
              type="line"
              position="month*acc"
              size={1}
              color="l (270) 0:rgba(255, 146, 255, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)"
              shape="smooth"
              style={{
                shadowColor: "l (270) 0:rgba(21, 146, 255, 0)",
                shadowBlur: 60,
                shadowOffsetY: 6,
              }}
            />
          </Chart>
        </Card>
        <Card className={commonStyle.rowBackground}>
          <Table
            bordered 
            className={`${styles.tableHeader} ${commonStyle.tableAdaption}`}
            dataSource={dataSource} 
            columns={columns} 
          />
        </Card>
      </div> 
    );
  }
}

export default SalesStatistics
