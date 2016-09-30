// @flow

/**
 * @module Sagas/User
 * @desc User
 */

import { takeEvery } from 'redux-saga';
import { put, call, fork } from 'redux-saga/effects';

import { ActionTypes } from 'constants/index';
import { goTo } from 'actions';
import { connectRoles, signInWithPopup, signInWithCredential, signOut } from 'utils/firebaseClient';

/**
 * Login
 * @param {Object} action
 */
export function* login(action) {
  try {
    const auth = yield call(signInWithPopup, action.payload.provider);
    yield call(connectRoles);

    yield put({
      type: ActionTypes.USER_LOGIN_SUCCESS,
      payload: {
        authenticated: true,
        credential: auth.credential,
        data: {
          uid: auth.user.uid,
          displayName: auth.user.displayName,
          email: auth.user.email,
          photoURL: auth.user.photoURL,
          refreshToken: auth.user.refreshToken
        }
      }
    });
    yield put(goTo('/cms'));
  }
  catch (error) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGIN_FAILURE,
      payload: error
    });
  }
}

/**
 * Restore
 */
export function* restore() {
  try {
    yield call(signInWithCredential);

    yield put({
      type: ActionTypes.USER_RESTORE_SUCCESS
    });
  }
  catch (error) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_RESTORE_FAILURE,
      payload: error
    });
  }
}

/**
 * Logout
 */
export function* logout() {
  try {
    yield call(signOut);

    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS
    });
    yield put(goTo('/'));
  }
  catch (error) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGOUT_FAILURE,
      payload: error
    });
  }
}

function* watchLogin() {
  yield* takeEvery(ActionTypes.USER_LOGIN_REQUEST, login);
}

function* watchRestore() {
  yield* takeEvery(ActionTypes.USER_RESTORE_REQUEST, restore);
}

function* watchLogout() {
  yield* takeEvery(ActionTypes.USER_LOGOUT_REQUEST, logout);
}

/**
 * User Sagas
 */
export default function* user() {
  yield fork(watchLogin);
  yield fork(watchRestore);
  yield fork(watchLogout);
}
