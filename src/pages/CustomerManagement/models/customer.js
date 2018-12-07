import {
  // 标签
  queryCustomerLabel,
  addCustomerLabel,
  delCustomerLabel,
  updateCustomerLabel,
  // 客户
  queryCustomer,
  addCustomer,
  delCustomer,
  updateCustomer,
} from '@/services/api';

export default {
  namespace: 'customer',

  state: {
    labelData: [],
    customerData: [],
    customer: {},
    dataTotal:0,
    payTotal:0,
    from:1,
  },

  effects: {
    // 查询标签
    *customerLabelinf({ callback }, { call, put }) {
      const response = yield call(queryCustomerLabel);
      yield put({
        type: 'queryCustomerLabel',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 增加标签
    *addLabel({ payload, callback }, { call, put }) {
      const response = yield call(addCustomerLabel, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 删除标签
    *delLabel({ payload, callback }, { call, put }) {
      const response = yield call(delCustomerLabel, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 更新标签
    *updateLabel({ payload, callback }, { call, put }) {
      const response = yield call(updateCustomerLabel, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 查询客户
    *customerinf({ payload, callback }, { call, put }) {
      const response = yield call(queryCustomer, payload);
      yield put({
        type: 'queryCustomer',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 增加客户
    *addCustomer({ payload, callback }, { call, put }) {
      const response = yield call(addCustomer, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 删除客户
    *delCustomer({ payload, callback }, { call, put }) {
      const response = yield call(delCustomer, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 更新客户
    *updateCustomer({ payload, callback }, { call, put }) {
      const response = yield call(updateCustomer, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    queryCustomerLabel(state, action) {
      return {
        ...state,
        labelData: action.payload.data,
      };
    },

    queryCustomer(state, action) {
      return {
        ...state,
        // customer: action.payload.data,
        from:action.payload.data.from,
        customerData: action.payload.data.data,
        dataTotal: action.payload.data.total,
        payTotal: action.payload.data.total_pay,
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
