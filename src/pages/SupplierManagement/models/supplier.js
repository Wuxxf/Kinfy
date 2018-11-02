import { querySupplier, addSupplier, delSupplier, updateSupplier } from '@/services/api';

export default {
  namespace: 'supplier',

  state: {
    supplierFrom: 0, //
    supplierData: [],
    supplierTotal: 0,
    payTotal: 0,
  },

  effects: {
    // 查询供应商
    *supplierinf({ callback, payload }, { call, put }) {
      const response = yield call(querySupplier, payload);
      yield put({
        type: 'querySupplier',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 增加供应商
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addSupplier, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 删除供应商
    *del({ payload, callback }, { call, put }) {
      const response = yield call(delSupplier, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 更新供应商
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateSupplier, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },
  reducers: {
    querySupplier(state, action) {
      return {
        ...state,
        supplierFrom: action.payload.data.from,
        supplierData: action.payload.data.data,
        supplierTotal: action.payload.data.total,
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
