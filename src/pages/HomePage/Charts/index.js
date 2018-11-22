import React, { Component } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";

import styles from '../Guide.less';
import commonStyle from '../../../global.less'; // 公共样式


class Charts extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  render() {
    const { chartData } = this.props;

    if (this.chart) {
      this.chart.forceFit();
    }

    const cols = {
      value: {
        alias:'销售额',
        min: 0,
      },
      day: {
        alias:'日',
        range: [0, 1],
      },

    };
    return (
      <div className={commonStyle['rowBackground-div']} style={{marginTop:'10px'}}>
        <Chart
          height={445}
          data={chartData}
          scale={cols}
          forceFit
          padding="auto"
          onGetG2Instance={(chart) => {
            this.chart = chart;
          }}
        >
          <span className={styles.title}>
            本月销售收入
          </span>
          <Axis name="day" line={{stroke: "#E6E6E6"}} title />
          <Axis name="value" line={{stroke: "#E6E6E6"}}  />
          <Tooltip
            crosshairs={{
              type: "y",
            }}
          />
          <Geom type="line" shape="smooth" position="day*value" size={2} />
        </Chart>
      </div>
    );
  }
}

export default Charts
