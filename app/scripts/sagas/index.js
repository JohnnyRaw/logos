import { fork } from 'redux-saga/effects';

import firebase from './firebase';
import user from './user';

/**
 * rootSaga
 */
export default function* root() {
  yield fork(user);
  yield fork(firebase);
}
