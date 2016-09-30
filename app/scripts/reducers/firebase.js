import { REHYDRATE } from 'redux-persist/constants';
import { createReducer } from 'utils/helpers';

import { ActionTypes } from 'constants/index';

export const firebaseState = {
  logos: {
    children: [],
    ready: false,
    running: false
  },
  tags: {
    children: [],
    ready: false,
    running: false
  },
  categories: {
    children: [],
    ready: false,
    running: false
  },
  ready: false,
  rehydrated: false,
  running: false
};

export default {
  firebase: createReducer(firebaseState, {
    [REHYDRATE](state, action) {
      return Object.assign({}, state, action.payload.firebase, {
        rehydrated: true
      });
    },
    [ActionTypes.CONNECT_LOGOS_REQUEST](state) {
      const logos = { ...state.logos, running: true };

      return { ...state, logos };
    },
    [ActionTypes.CONNECT_LOGOS_UPDATE](state, action) {
      const logos = { ...state.logos, ...action.payload, ready: true };

      return { ...state, logos };
    },
    [ActionTypes.CONNECT_LOGOS_FAILURE](state, action) {
      const logos = { ...state.logos, ...action.payload, ready: false, running: false };

      return { ...state, logos, ready: false };
    },
    [ActionTypes.CONNECT_TAGS_REQUEST](state) {
      const tags = { ...state.tags, running: true };

      return { ...state, tags };
    },
    [ActionTypes.CONNECT_TAGS_UPDATE](state, action) {
      const tags = { ...state.tags, ...action.payload, ready: true };

      return { ...state, tags };
    },
    [ActionTypes.CONNECT_TAGS_FAILURE](state, action) {
      const tags = { ...state.tags, ...action.payload, ready: false, running: false };

      return { ...state, tags, ready: false };
    },
    [ActionTypes.CONNECT_CATEGORIES_REQUEST](state) {
      const categories = { ...state.categories, running: true };

      return { ...state, categories };
    },
    [ActionTypes.CONNECT_CATEGORIES_UPDATE](state, action) {
      const categories = { ...state.categories, ...action.payload, ready: true };

      return { ...state, categories };
    },
    [ActionTypes.CONNECT_CATEGORIES_FAILURE](state, action) {
      const categories = { ...state.categories, ...action.payload, ready: false, running: false };

      return { ...state, categories, ready: false };
    },
    [ActionTypes.CONNECT_FIREBASE_REQUEST](state) {
      return { ...state, running: true };
    },
    [ActionTypes.CONNECT_FIREBASE_SUCCESS](state) {
      return { ...state, ready: true, running: false };
    },
    [ActionTypes.CONNECT_FIREBASE_FAILURE](state) {
      return { ...state, ready: false, running: false };
    }
  })
};

