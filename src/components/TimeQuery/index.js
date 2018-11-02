import React, { Component } from 'react';
import moment from 'moment';
import { Radio } from 'antd';


const RadioGroup = Radio.Group;
// 当前日
const day = moment().date(); // 1-31
// 获取当前月
const month = moment().month() + 1;
// 天数（月）
const daysInMonth = moment().daysInMonth();
// 星期几(本周)
const thisWeeksDay = moment().weekday(); // 1-7
// 本周
const thisWeeks = [
  moment().date(day - thisWeeksDay).format('YYYY-MM-DD'),
  moment().date(day - thisWeeksDay + 6).format('YYYY-MM-DD'),
];
// 上周
const lastWeeks = [
  moment().weekday(-7).format('YYYY-MM-DD'),
  moment().weekday(-7).add(6, 'days').format('YYYY-MM-DD'),
];
// 获取上个月 (带年份)
const lastMonthDay = moment().month(month - 2).format('YYYY-MM');
// 上个月天数
const daysInLastMonth = moment(lastMonthDay, 'YYYY-MM').daysInMonth();

// 本月
const thisMonth = [
  moment().date(1).format('YYYY-MM-DD'),
  moment().date(daysInMonth).format('YYYY-MM-DD'),
];

// 上月
const lastMonth = [
  moment(`${lastMonthDay}-01`).format('YYYY-MM-DD'),
  moment(`${lastMonthDay}-${daysInLastMonth}`).format('YYYY-MM-DD'),
];

// 年份
const nowYear = moment().year();

const quarter = ['01-03', '04-06', '07-09', '10-12'];
// 季度
const nowQuarter = moment().quarter();

const quarterMonth = quarter[nowQuarter - 1].split('-');
const days = moment(`${nowYear}-${quarterMonth[1]}`, 'YYYY-MM').daysInMonth();

const thisQuarter = [
  moment(`${nowYear}-${quarterMonth[0]}-01 00:00`).format('YYYY-MM-DD'),
  moment(`${nowYear}-${quarterMonth[1]}-${days} 23:59`).format('YYYY-MM-DD'),
];

// 上季度
let lasQuarterNum = nowQuarter - 1;
let year = nowYear;
if (lasQuarterNum === 0) {
  lasQuarterNum = 4;
  year -= 1;
}
const lastQuarterMonth = quarter[lasQuarterNum - 1].split('-');
const lastQuarterDays = moment(`${year}-${lastQuarterMonth[1]}`, 'YYYY-MM').daysInMonth();
const lastQuarter = [
  moment(`${year}-${lastQuarterMonth[0]}-01 00:00`).format('YYYY-MM-DD'),
  moment(`${year}-${lastQuarterMonth[1]}-${lastQuarterDays} 23:59`).format('YYYY-MM-DD'),
];

// 今年
const thisYear = [
  moment(`${nowYear}-01-01 00:00`).format('YYYY-MM-DD'),
  moment(`${nowYear}-12-31 23:59`).format('YYYY-MM-DD'),
];

// 去年
const lastYear = [
  moment(`${nowYear-1}-01-01 00:00`).format('YYYY-MM-DD'),
  moment(`${nowYear-1}-12-31 23:59`).format('YYYY-MM-DD'),
];

export default class TimeQuery extends Component {
  state ={
    radioValue:1,
  }

  componentWillReceiveProps(nextProps){
      if(nextProps.defaultValue !== this.props.defaultValue){
        this.setState({
           radioValue:nextProps.defaultValue,
        });
        console.log(nextProps.defaultValue)
      }
  }

  onChange=(e)=>{
    this.setState({
      radioValue:e.target.value,
    })
    const id = e.target.value;
    if(id===1){
      this.props.callback(thisWeeks)
      // console.log("本周",thisWeeks)
    }
    else if(id===2){
      // console.log("上周",lastWeeks)
      this.props.callback(lastWeeks)
    }
    else if(id===3){
      this.props.callback(thisMonth)
      // console.log("本月",thisMonth)
    }
    else if(id===4){
      this.props.callback(lastMonth)
      // console.log("上月",lastMonth)
    }
    else if(id===5){
      this.props.callback(thisQuarter)
      // console.log("本季度",thisQuarter)
    }
    else if(id===6){
      this.props.callback(lastQuarter)
      // console.log("上季度",lastQuarter)
    }
    else if(id===7){
      this.props.callback(thisYear)
      // console.log("今年",thisYear)
    }
    else if(id===8){
      this.props.callback(lastYear)
      // console.log("去年",lastYear)
    }  
    
  }
  
  render() {

    return (
      <div>
        <RadioGroup onChange={this.onChange} name="timeQuery" value={this.state.radioValue}>
          <Radio value={1}>本周</Radio>
          <Radio value={2}>上周</Radio>
          <Radio value={3}>本月</Radio>
          <Radio value={4}>上月</Radio>
          <Radio value={5}>本季度</Radio>
          <Radio value={6}>上季度</Radio>
          <Radio value={7}>本年</Radio>
          <Radio value={8}>去年</Radio>
        </RadioGroup>
      </div> 
    );
  }
}
