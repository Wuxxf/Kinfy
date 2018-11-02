import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';

import commonStyle from '../../global.less'; // 公共样式

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
class Guide extends Component {
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
    if (nextProps.supplier !== this.props.supplier) {
      this.setState({
        supplierData: nextProps.supplier.supplierData,
      });
    }
  }

  render() {
    return <div className={commonStyle.rowBackground}>a</div>;
  }
}

export default Guide