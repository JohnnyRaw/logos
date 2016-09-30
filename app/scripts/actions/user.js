/**
 * @module Actions/User
 * @desc Actions for the user
 */

import { ActionTypes } from 'constants/index';

/**
 * Login
 *
 * @param {string} provider
 * @returns {Object}
 */
export function login(provider) {
  return {
    type: ActionTypes.USER_LOGIN_REQUEST,
    payload: { provider }
  };
}

/**
 * Restore use authentication
 *
 * @returns {Object}
 */
export function restore() {
  return {
    type: ActionTypes.USER_RESTORE_REQUEST
  };
}

/**
 * Logout
 *
 * @returns {Object}
 */
export function logOut() {
  return {
    type: ActionTypes.USER_LOGOUT_REQUEST
  };
}
