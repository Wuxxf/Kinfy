import { queryGuide , addCommonlyUsed , delCommonlyUsed } from '@/services/api';

export default {
  namespace: 'guide',
  state: {
    data:[],   //  chart Data
    notice:[], // 公告
    commonlyUsed:[],
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

    // 删除常用功能
    *fetchCommonlyUsedDel({ payload, callback }, { call, put }) {
      const response = yield call(delCommonlyUsed, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 添加常用功能
    *fetchCommonlyUsedAdd({ payload, callback }, { call, put }) {
      const response = yield call(addCommonlyUsed, payload);
      yield put({
        type: 'save',
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
        salesPay:action.payload.data.income,            // 本月销售收入
        receiptPay:action.payload.data.pay,             // 本月销售收款
        customerPay:action.payload.data.customer_pay ,  // 客户欠款
        supplierPay:action.payload.data.supplier_pay,   // 欠供应商款
        stockNumber:action.payload.data.stock,          // 当前库存数量
        stockPay:action.payload.data.cost,              // 当前库存成本
        notice:action.payload.data.notice,              // 公告
        commonlyUsed:action.payload.data.button,        // 常用功能
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
