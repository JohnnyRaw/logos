import { REHYDRATE } from 'redux-persist/constants';
import { createReducer } from 'utils/helpers';

import { ActionTypes } from 'constants/index';

export const userState = {
  authenticated: false,
  credential: {},
  isAdmin: false,
  data: {},
  running: false,
  ready: false,
  rehydrated: false
};

export default {
  user: createReducer(userState, {
    [REHYDRATE](state, action) {
      return {
        ...state,
        ...action.payload.user,
        rehydrated: true
      };
    },
    [ActionTypes.USER_LOGIN_REQUEST](state) {
      return { ...state, running: true };
    },
    [ActionTypes.USER_LOGIN_SUCCESS](state, action) {
      return { ...state, ...action.payload, running: false, ready: true };
    },
    [ActionTypes.USER_PERMISSIONS](state, action) {
      return { ...state, ...action.payload };
    },
    [ActionTypes.USER_LOGOUT_SUCCESS]() {
      return { ...userState, rehydrated: true };
    }
  })
};

