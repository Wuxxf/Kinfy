import {
  addStore,
  delStore,
  queryStore,
  updateStore,
  queryStoreDetails,
  queryIndustry,
  querySystemBulletin,
  isreadSystemNotice,
  queryEmployee,
  addEmployee,
  updateEmployee,
  delEmployee,
  queryRole,
} from '@/services/api';

export default {
  namespace: 'store',

  state: {
    dataSource:[],  // 数据源
    total:0,        // 数量
    from:1,         // 给列序号用

    storeData: [],
    IndustryData: [],
    systemBulletinData: [], // 系统公告数据
    employeeData: [],
    roleData: [],
  },

  effects: {
    // 获取门店
    *fetchStoreInfo({ callback }, { call, put }) {
      const response = yield call(queryStore);
      yield put({
        type: 'fetch',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取门店详情
    *fetchStoreDetails({payload,callback }, { call, put }) {
      const response = yield call(queryStoreDetails,payload);
      yield put({
        type: 'fetchDetails',
        payload: response,
      });
      if (callback) callback(response);
    },
    
    // 获取员工
    *fetchEmployee(_, { call, put }) {
      const response = yield call(queryEmployee);
      yield put({
        type: 'queryEmployee',
        payload: response,
      });
    },

    // 系统公告
    *systemBulletin({ callback }, { call, put }) {
      const response = yield call(querySystemBulletin);
      yield put({
        type: 'querySystemBulletin',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 是否已读
    *isread({ payload, callback }, { call, put }) {
      const response = yield call(isreadSystemNotice, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 增加门店
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addStore, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 删除门店
    *del({ payload, callback }, { call, put }) {
      const response = yield call(delStore, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 更新门店
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateStore, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 查询行业
    *storeind({ callback }, { call, put }) {
      const response = yield call(queryIndustry);
      yield put({
        type: 'queryIndustry',
        payload: response,
      });
      if (callback) callback(response);
    },


    // 增加员工
    *fetchEmployeeAdd({ payload, callback }, { call, put }) {
      const response = yield call(addEmployee, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 编辑员工
    *fetchEmployeeUpdate({ payload, callback }, { call, put }) {
      const response = yield call(updateEmployee, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 删除员工
    *fetchEmployeeDel({ payload, callback }, { call, put }) {
      const response = yield call(delEmployee, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 查询角色
    *fetchRole(_, { call, put }) {
      const response = yield call(queryRole);
      yield put({
        type: 'queryRole',
        payload: response,
      });
    },
  },

  reducers: {
     // 获取
    fetch(state, action) {
      return {
        ...state,
        from:action.payload.data.from,
        dataSource: action.payload.data,
        total:action.payload.data.total,
      };
    },

    // 获取门店详情
    fetchDetails(state, action) {
      return {
        ...state,
        dataDetails: action.payload.data,
      };
    },

    // 查询系统公告
    querySystemBulletin(state, action) {
      return {
        ...state,
        systemBulletinData: action.payload.data.data,
      };
    },

    // 查询行业
    queryIndustry(state, action) {
      return {
        ...state,
        IndustryData: action.payload.data,
      };
    },

    // 查询员工
    queryEmployee(state, action) {
      return {
        ...state,
        from:action.payload.data.from,
        employeeData: action.payload.data.data,
        total:action.payload.data.total,
      };
    },

    // 查询角色
    queryRole(state, action) {
      return {
        ...state,
        roleData: action.payload.data.data,
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
