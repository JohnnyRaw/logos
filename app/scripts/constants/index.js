import keyMirror from 'fbjs/lib/keyMirror';

/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */


export const ActionTypes = keyMirror({
  USER_LOGIN_REQUEST: undefined,
  USER_LOGIN_SUCCESS: undefined,
  USER_LOGIN_FAILURE: undefined,
  USER_RESTORE_REQUEST: undefined,
  USER_RESTORE_SUCCESS: undefined,
  USER_RESTORE_FAILURE: undefined,
  USER_LOGOUT_REQUEST: undefined,
  USER_LOGOUT_SUCCESS: undefined,
  USER_LOGOUT_FAILURE: undefined,
  USER_PERMISSIONS: undefined,
// DATA
  CONNECT_FIREBASE_REQUEST: undefined,
  CONNECT_FIREBASE_SUCCESS: undefined,
  CONNECT_FIREBASE_FAILURE: undefined,
// LOGOS
  CONNECT_LOGOS_REQUEST: undefined,
  CONNECT_LOGOS_SUCCESS: undefined,
  CONNECT_LOGOS_UPDATE: undefined,
  CONNECT_LOGOS_FAILURE: undefined,
  UPDATE_LOGOS_REQUEST: undefined,
  UPDATE_LOGOS_SUCCESS: undefined,
  UPDATE_LOGOS_FAILURE: undefined,
// TAGS
  CONNECT_TAGS_REQUEST: undefined,
  CONNECT_TAGS_SUCCESS: undefined,
  CONNECT_TAGS_UPDATE: undefined,
  CONNECT_TAGS_FAILURE: undefined,
  UPDATE_TAGS_REQUEST: undefined,
  UPDATE_TAGS_SUCCESS: undefined,
  UPDATE_TAGS_FAILURE: undefined,
// CATEGORIES
  CONNECT_CATEGORIES_REQUEST: undefined,
  CONNECT_CATEGORIES_SUCCESS: undefined,
  CONNECT_CATEGORIES_UPDATE: undefined,
  CONNECT_CATEGORIES_FAILURE: undefined,
  UPDATE_CATEGORIES_REQUEST: undefined,
  UPDATE_CATEGORIES_SUCCESS: undefined,
  UPDATE_CATEGORIES_FAILURE: undefined,
  FILTER_ITEMS: undefined,
  SHOW_ALERT: undefined,
  HIDE_ALERT: undefined
});

/**
 * @constant {Object} XHR
 * @memberof Constants
 */
export const XHR = keyMirror({
  SUCCESS: undefined,
  FAIL: undefined
});
