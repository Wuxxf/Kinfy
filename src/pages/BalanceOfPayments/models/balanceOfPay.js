import { queryRevenue,queryExpenditure } from '@/services/api';

export default {
  namespace: 'balanceOfPay',
  state: {
    // 收入单据
    dataSource: [],
    dataFrom:[],
  },

  effects: {
    // 获取收入单据
    *fetchRevenue({ payload, callback }, { call, put }) {
      const response = yield call(queryRevenue, payload);
      yield put({
        type: 'query',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取支出单据
    *fetchExpenditure({ payload, callback }, { call, put }) {
      const response = yield call(queryExpenditure, payload);
      yield put({
        type: 'query',
        payload: response,
      });
      if (callback) callback(response);
    },
  },
  reducers: {
    // 查询报损原因
    query(state, action) {
      return {
        ...state,
        dataFrom:action.payload.data.from,
        dataSource: action.payload.data.data,
        dataTotal:action.payload.data.total,
      };
    },

    // 添加、删除、更新
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
