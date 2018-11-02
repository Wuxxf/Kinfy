import React, { Component } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import style from './index.less';

// 当前日期
const now = moment().format('YYYY-MM-DD H:mm');

// 获取当前月
let thisMonth = moment().month() + 1;
if (thisMonth < 10) {
  thisMonth = `0${thisMonth}`;
}

// 获取上个月 (带年份)
const lastMonthDay = moment()
  .month(thisMonth - 2)
  .format('YYYY-MM');

// 天数（月）
const daysInMonth = moment().daysInMonth();

// 上个月天数
const daysInLastMonth = moment(lastMonthDay, 'YYYY-MM').daysInMonth();

// 年份
const thisYear = moment().year();

const quarter = ['01-03', '04-06', '07-09', '10-12'];
// 季度
const thisQuarter = moment(now).quarter();

// 上季度
const lasQuarterDate = moment()
  .month(thisMonth - 4)
  .format('YYYY-MM');
let lasQuarter = moment(`${lasQuarterDate}-01`).quarter();

export default class TimeSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thisMonthState: 'primary',
      lastMonthState: 'default',
      thisQuarterState: 'default',
      lastQuarterState: 'default',
      thisYearState: 'default',
      lastYearState: 'default',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.buttonStyles === 'default') {
      this.setState({
        thisMonthState: 'default',
        lastMonthState: 'default',
        thisQuarterState: 'default',
        lastQuarterState: 'default',
        thisYearState: 'default',
        lastYearState: 'default',
      });
    }
  }

  // 本月
  thisMonth = () => {
    const rangeTime = [
      moment(`${thisYear}-${thisMonth}`),
      moment(`${thisYear}-${thisMonth}-${daysInMonth}`),
    ];

    if (this.state.thisMonthState === 'default') {
      this.setState({
        thisMonthState: 'primary',
        lastMonthState: 'default',
        thisQuarterState: 'default',
        lastQuarterState: 'default',
        thisYearState: 'default',
        lastYearState: 'default',
      });
    }
    this.props.callbackParent(rangeTime);
  };

  // 上月
  lastMonth = () => {
    const rangeTime = [
      moment(`${lastMonthDay}-01 00:00`),
      moment(`${lastMonthDay}-${daysInLastMonth} 23:59`),
    ];

    if (this.state.lastMonthState === 'default') {
      this.setState({
        thisMonthState: 'default',
        lastMonthState: 'primary',
        thisQuarterState: 'default',
        lastQuarterState: 'default',
        thisYearState: 'default',
        lastYearState: 'default',
      });
    }
    this.props.callbackParent(rangeTime);
  };

  // 本季度
  thisQuarter = () => {
    const quarterMonth = quarter[thisQuarter - 1].split('-');
    const days = moment(`${thisYear}-${quarterMonth[1]}`, 'YYYY-MM').daysInMonth();

    const rangeTime = [
      moment(`${thisYear}-${quarterMonth[0]}-01 00:00`),
      moment(`${thisYear}-${quarterMonth[1]}-${days} 23:59`),
    ];

    if (this.state.thisQuarterState === 'default') {
      this.setState({
        thisMonthState: 'default',
        lastMonthState: 'default',
        thisQuarterState: 'primary',
        lastQuarterState: 'default',
        thisYearState: 'default',
        lastYearState: 'default',
      });
    }

    this.props.callbackParent(rangeTime);
  };

  // 上季度
  lastQuarter = () => {
    let year = thisYear;

    if (thisQuarter === 1) {
      lasQuarter = 4;
      year -= 1;
    }

    const quarterMonth = quarter[lasQuarter - 1].split('-');
    const days = moment(`${year}-${quarterMonth[1]}`, 'YYYY-MM').daysInMonth();

    const rangeTime = [
      moment(`${year}-${quarterMonth[0]}-01 00:00`),
      moment(`${year}-${quarterMonth[1]}-${days} 23:59`),
    ];

    if (this.state.lastQuarterState === 'default') {
      this.setState({
        thisMonthState: 'default',
        lastMonthState: 'default',
        thisQuarterState: 'default',
        lastQuarterState: 'primary',
        thisYearState: 'default',
        lastYearState: 'default',
      });
    }

    this.props.callbackParent(rangeTime);
  };

  // 今年
  thisYear = () => {
    const rangeTime = [moment(`${thisYear}-01-01 00:00`), moment(`${thisYear}-12-31 23:59`)];

    if (this.state.thisYearState === 'default') {
      this.setState({
        thisMonthState: 'default',
        lastMonthState: 'default',
        thisQuarterState: 'default',
        lastQuarterState: 'default',
        thisYearState: 'primary',
        lastYearState: 'default',
      });
    }

    this.props.callbackParent(rangeTime);
  };

  // 去年
  lastYear = () => {
    const rangeTime = [
      moment(`${thisYear - 1}-01-01 00:00`),
      moment(`${thisYear - 1}-12-31 23:59`),
    ];

    if (this.state.lastYearState === 'default') {
      this.setState({
        thisMonthState: 'default',
        lastMonthState: 'default',
        thisQuarterState: 'default',
        lastQuarterState: 'default',
        thisYearState: 'default',
        lastYearState: 'primary',
      });
    }
    this.props.callbackParent(rangeTime);
  };

  render() {
    const {
      thisMonthState,
      lastMonthState,
      thisQuarterState,
      lastQuarterState,
      thisYearState,
      lastYearState,
    } = this.state;

    return (
      <div>
        <div className={style.buttonGroup}>
          <Button onClick={this.thisMonth} type={thisMonthState} style={{ marginTop: 5 }}>
            本　月
          </Button>
          <Button onClick={this.lastMonth} type={lastMonthState} style={{ marginTop: 5 }}>
            上　月
          </Button>
          <Button onClick={this.thisQuarter} type={thisQuarterState} style={{ marginTop: 5 }}>
            本季度
          </Button>
          <Button onClick={this.lastQuarter} type={lastQuarterState} style={{ marginTop: 5 }}>
            上季度
          </Button>
          <Button onClick={this.thisYear} type={thisYearState} style={{ marginTop: 5 }}>
            今　年
          </Button>
          <Button onClick={this.lastYear} type={lastYearState} style={{ marginTop: 5 }}>
            去　年
          </Button>
        </div>
      </div>
    );
  }
}
