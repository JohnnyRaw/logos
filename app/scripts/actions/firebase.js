/**
 * @module Actions/Firebase
 * @desc Firebase Actions
 */

import { ActionTypes } from 'constants/index';

/**
 * Init Firebase
 *
 * @returns {Object}
 */
export function initFirebase() {
  return {
    type: ActionTypes.CONNECT_FIREBASE_REQUEST
  };
}

/**
 * Connect Logos
 *
 * @returns {Object}
 */
export function connectLogos() {
  return {
    type: ActionTypes.CONNECT_LOGOS_REQUEST
  };
}

/**
 * Connect Tags
 *
 * @returns {Object}
 */
export function connectTags() {
  return {
    type: ActionTypes.CONNECT_TAGS_REQUEST
  };
}

/**
 * Connect Categories
 *
 * @returns {Object}
 */
export function connectCategories() {
  return {
    type: ActionTypes.CONNECT_CATEGORIES_REQUEST
  };
}


/**
 * Update Logos
 *
 * @param {Object} payload
 * @param {function} [callback]
 *
 * @returns {Object}
 */
export function updateLogos(payload, callback) {
  return {
    type: ActionTypes.UPDATE_LOGOS_REQUEST,
    payload,
    meta: {
      callback
    }
  };
}
