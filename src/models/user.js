import { query as queryUsers, queryCurrent , queryHeaderStore , replaceStore } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchStore(_, { call, put }) {
      const response = yield call(queryHeaderStore);
      yield put({
        type: 'saveStore',
        payload: response,
      });
    },
    *replaceStore({ payload, callback }, { call, put }) {
      const response = yield call(replaceStore, payload);
      yield put({
        type: 'store',
        payload: response,
      });
      if (callback) callback(response);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
    saveStore(state, action) {
      return {
        ...state,
        currentStore: action.payload.data || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    store(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
