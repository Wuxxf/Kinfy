import { routerRedux } from 'dva/router';
// import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha,logout ,enterStore} from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload,callback }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (callback) callback(response); // kinfy
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }

      // 没有门店
      if(response.store === 0){
        reloadAuthorized();

        yield put(routerRedux.push('/user/create-store'));
        // Login successfully
      }

    },

    *enterStore({ payload, callback }, { call, put }) {
      const response = yield call(enterStore, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // console.log(response)
      if (response.status === 'ok') {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
      // if (response.errcode === 0) {
      //   reloadAuthorized();
      //   yield put(routerRedux.push('/'));
      // }
      if (callback) callback(response);
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put,call }) {
      yield put({
        type: 'changeLoginStatus',
        // payload: {
        //   status: false,
        //   currentAuthority: 'guest',
        // },
        payload: {
          status: false,
          data:{data:[ 'guest']},
        },
      });
      yield call(logout);
      reloadAuthorized();
      yield put(routerRedux.push('/user/login'));
      // yield put(
      //   routerRedux.push({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   })
      // );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      if(payload.data)
        setAuthority(payload.data.data);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
