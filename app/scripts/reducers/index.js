import app from './app';
import firebase from './firebase';
import user from './user';

export default {
  ...app,
  ...firebase,
  ...user
};
