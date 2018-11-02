import {
  queryCauseOfLoss,
  addCauseOfLoss,
  delCauseOfLoss,
  updateCauseOfLoss,
  queryUnitsData,
  addUnitsData,
  delUnitsData,
  updateUnitsData,
  queryCategory,
  queryCategoryList,
  addCategory,
  delCategory,
  updateCategory,
  queryProductList,
  addProductList,
  delProductList,
  updateProductList,
  queryReportLoss,
  addReportLoss,
  delReportLoss,
  updateReportLoss,
} from '@/services/api';

export default {
  namespace: 'product',
  state: {
    // 报损原因
    causeOfLossData: [],
    // 货品单位
    unitsData: [],
    // 货品类别
    categoryData: {},
    categoryDataList: {},
    // 货品列表
    productData: [],
    // 总货品数
    productTotal: 0,
    dataFrom: 0,
    // 报损查询
    reportLossData: [],
  },

  effects: {
    // 查询报损原因
    *causeoflossinf({ callback }, { call, put }) {
      const response = yield call(queryCauseOfLoss);
      yield put({
        type: 'queryCauseOfLoss',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 增加报损原因
    *causeoflossadd({ payload, callback }, { call, put }) {
      const response = yield call(addCauseOfLoss, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 删除报损原因
    *causeoflossdel({ payload, callback }, { call, put }) {
      const response = yield call(delCauseOfLoss, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 更新报损原因
    *causeoflossupdate({ payload, callback }, { call, put }) {
      const response = yield call(updateCauseOfLoss, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 查询货品单位
    *unitsinf({ callback }, { call, put }) {
      const response = yield call(queryUnitsData);
      yield put({
        type: 'queryUnitsData',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 增加货品单位
    *unitsadd({ payload, callback }, { call, put }) {
      const response = yield call(addUnitsData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 删除货品单位
    *unitsdel({ payload, callback }, { call, put }) {
      const response = yield call(delUnitsData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 更新货品单位
    *unitsupdate({ payload, callback }, { call, put }) {
      const response = yield call(updateUnitsData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 查询货品类别
    *categoryinf({ callback }, { call, put }) {
      const response = yield call(queryCategory);
      yield put({
        type: 'queryCategory',
        payload: response,
      });
      if (callback) callback(response);
    },

    *categoryinfList({ payload, callback }, { call, put }) {
      const response = yield call(queryCategoryList, payload);
      yield put({
        type: 'queryCategoryList',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 添加货品类别
    *categoryadd({ payload, callback }, { call, put }) {
      const response = yield call(addCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 删除货品类别
    *categorydel({ payload, callback }, { call, put }) {
      const response = yield call(delCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 更新货品类别
    *categoryupdate({ payload, callback }, { call, put }) {
      const response = yield call(updateCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 查询货品列表
    *productListind({ callback, payload }, { call, put }) {
      const response = yield call(queryProductList, payload);
      yield put({
        type: 'queryProductList',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 添加货品列表
    *productListadd({ payload, callback }, { call, put }) {
      const response = yield call(addProductList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 删除货品列表
    *productListdel({ payload, callback }, { call, put }) {
      const response = yield call(delProductList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 更新货品列表
    *productListupdate({ payload, callback }, { call, put }) {
      const response = yield call(updateProductList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 查询报损
    *reportLossinf({ callback }, { call, put }) {
      const response = yield call(queryReportLoss);
      yield put({
        type: 'queryReportLoss',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 添加报损
    *reportLossadd({ payload, callback }, { call, put }) {
      const response = yield call(addReportLoss, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除货品列表
    *reportLossdel({ payload, callback }, { call, put }) {
      const response = yield call(delReportLoss, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 更新货品列表
    *reportLossupdate({ payload, callback }, { call, put }) {
      const response = yield call(updateReportLoss, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },
  reducers: {
    // 查询报损原因
    queryCauseOfLoss(state, action) {
      return {
        ...state,
        causeOfLossData: action.payload.data.data,
      };
    },

    // 查询货品单位
    queryUnitsData(state, action) {
      return {
        ...state,
        unitsData: action.payload.data.data,
      };
    },

    // 货品类别查询
    queryCategory(state, action) {
      return {
        ...state,
        categoryData: action.payload.data,
      };
    },

    queryCategoryList(state, action) {
      return {
        ...state,
        categoryDataList: action.payload.data,
      };
    },

    // 货品列表查询
    queryProductList(state, action) {
      return {
        ...state,
        productData: action.payload.data.data,
        dataFrom: action.payload.data.from,
        productTotal: action.payload.data.total,
      };
    },

    // 报损查询
    queryReportLoss(state, action) {
      return {
        ...state,
        reportLossData: action.payload.data.data,
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
