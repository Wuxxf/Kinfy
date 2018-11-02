import { queryGuide } from '@/services/api';

export default {
  namespace: 'guide',

  state: {
    data:[],
  },

  effects: {

    // 查询
    *fetch({ callback }, { call, put }) {
      const response = yield call(queryGuide);
      yield put({
        type: 'queryGuide',
        payload: response,
      });
      if (callback) callback(response);
    },
    
  },
  reducers: {
    queryGuide(state, action) {
      return {
        ...state,
        data: action.payload.data.pay_info,
        salesPay:action.payload.data.income,  // 本月销售收入
        receiptPay:action.payload.data.pay,// 本月销售收款
        // salesNumber:action.payload.data.salesNumber,// 本月销售数量
        customerPay:action.payload.data.customer_pay , // 客户欠款
        supplierPay:action.payload.data.supplier_pay, // 欠供应商款
        stockNumber:action.payload.data.stock,    // 当前库存数量
        stockPay:action.payload.data.cost, // 当前库存成本
      };
    },

    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
