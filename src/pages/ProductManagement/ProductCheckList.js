import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
 class ProductCheckList extends Component {
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
    return (
      <div>
        <Card>a</Card>
        a
      </div>
    );
  }
}
export default  ProductCheckList