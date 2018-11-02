import { fakeRegister } from '@/services/api';
// import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      console.log(response)
      yield put({
        type: 'registerHandle',
        payload: response,
      });
      if (callback) callback(response);
      
    },

  },

  reducers: {
    registerHandle(state,{payload}) {
      // setAuthority(0);
      reloadAuthorized();
      console.log(payload)
      return {
        ...state,
        // error:payload.mobile_phone,
        // status: payload.errcode,
      };
    },
  },
};
