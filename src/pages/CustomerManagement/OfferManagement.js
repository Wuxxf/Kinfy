import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
export default class EmployeeManagement extends Component {
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

  render() {
    return <div>a</div>;
  }
}
