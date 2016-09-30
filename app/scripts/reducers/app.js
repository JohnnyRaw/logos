import { REHYDRATE } from 'redux-persist/constants';
import { createReducer } from 'utils/helpers';

import { ActionTypes } from 'constants/index';

export const appState = {
  notifications: {
    visible: false,
    message: '',
    status: '',
    withTimeout: true
  },
  filter: {
    category: '',
    columns: 3,
    search: '',
    showTags: false,
    tag: '',
    view: 'latest',
    viewBefore: ''
  },
  rehydrated: false
};

export default {
  app: createReducer(appState, {
    [REHYDRATE](state, action) {
      const filter = action.payload.app ? action.payload.app.filter : appState.filter;

      return {
        ...state,
        filter: { ...filter, showTags: false },
        notifications: appState.notifications,
        rehydrated: true
      };
    },
    [ActionTypes.SHOW_ALERT](state, action) {
      const notifications = {
        ...state.notifications,
        visible: true,
        message: action.message,
        status: action.status,
        withTimeout: action.withTimeout === true
      };

      return { ...state, notifications };
    },
    [ActionTypes.HIDE_ALERT](state) {
      const notifications = {
        ...state.notifications,
        visible: false,
        withTimeout: true
      };

      return { ...state, notifications };
    },
    [ActionTypes.FILTER_ITEMS](state, action) {
      const { payload } = action;
      const view = payload.tag || payload.category || payload.search ? 'all' : (state.filter.viewBefore || state.filter.view);
      const viewBefore = (payload.tag || payload.category || payload.search) && state.filter.view !== 'all' ? state.filter.view : '';
      let filter;

      if (typeof payload.showTags !== 'undefined') {
        filter = { ...state.filter, ...payload };
      }
      else {
        filter = {
          ...appState.filter,
          columns: state.filter.columns,
          view,
          viewBefore,
          ...payload
        };
      }

      return { ...state, filter };
    }
  })
};
