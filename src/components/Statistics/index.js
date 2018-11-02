import React, { Component } from 'react';
import { Tooltip, Row, Col, Switch } from 'antd';

import styles from './index.less'; // 公共样式

export default class Statistics extends Component {
  render() {
    const { switchange, switchLoding, dataSource } = this.props;

    const pushSwitch = push => {
      const l = dataSource.length;
      if (l % (24 / push) === 0) {
        return 22;
      } else {
        return 24 - (l % (24 / push)) * push - 2;
      }
    };

    const total = dataSource.map(fields => {
      if (!switchLoding) {
        return (
          <Col xs={24} sm={11} md={8} lg={8} xl={4} key={fields.title}>
            <Tooltip title={`${fields.title}：${fields.total}${fields.units}`}>
              <div className={styles.statistics}>
                {fields.title}：{fields.total}
                {fields.units}
              </div>
            </Tooltip>
          </Col>
        );
      } else {
        return (
          <Col xs={24} sm={11} md={8} lg={8} xl={4} key={fields.title}>
            <Tooltip title={`${fields.title}：********${fields.units}`}>
              <div className={styles.statistics}>
                {fields.title}：********{fields.units}
              </div>
            </Tooltip>
          </Col>
        );
      }
    });
    return (
      <div>
        <Row gutter={16}>
          {total}
          <Col
            xs={24}
            sm={2}
            md={{ span: 2, push: pushSwitch(8) }}
            lg={{ span: 2, push: pushSwitch(8) }}
            xl={{ span: 2, push: pushSwitch(4) }}
          >
            <div style={{ lineHeight: 2, marginTop: '9px', float: 'right' }}>
              <Switch checked={!switchLoding} onChange={switchange} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
