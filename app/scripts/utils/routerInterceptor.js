// @flow

/**
 * Router methods
 * @module routerInterceptor
 */

import scroll from 'scroll';
import scrollDoc from 'scroll-doc';
import ease from 'ease-component';

import { goTo } from 'actions';
import { dispatch, getState, subscribe } from 'store';

const page = scrollDoc();

/**
 * Scroll to the top before navigate
 * @param {Object} nextState
 * @param {Object} transition
 * @param {function} callback
 */
export function scrollBefore(nextState, transition, callback) {
  scroll.top(page, 0, { ease: ease.inBounce }, () => {
    callback();
  });
}

/**
 * Navigate
 * @param {Object} nextState
 * @param {Object} transition
 * @param {function} callback
 *
 * @returns {function}
 */
function navigate(nextState, transition, callback) {
  const pathname = nextState.location.pathname;
  const { user } = getState();

  if (user.ready) {
    if (!user.isAdmin && pathname === '/cms') {
      return dispatch(goTo('/login'));
    }
    else if (user.isAdmin && pathname === '/login') {
      return dispatch(goTo('/cms'));
    }

    return scrollBefore(nextState, transition, callback);
  }
  else if (pathname === '/cms') {
    return dispatch(goTo('/login'));
  }

  return callback();
}

/**
 * Check user status and redirect if not authorized
 * @param {Object} nextState
 * @param {Object} transition
 * @param {function} callback
 */
export function checkStatus(nextState, transition, callback) {
  if (getState().user.rehydrated) {
    navigate(nextState, transition, callback);
  }
  else {
    const unsubscribe = subscribe(() => {
      if (getState().user.rehydrated) {
        unsubscribe();
        navigate(nextState, transition, callback);
      }
    });
  }
}
