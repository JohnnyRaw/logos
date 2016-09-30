import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { checkStatus } from 'utils/routerInterceptor';

import App from 'containers/App';
import AppPublic from 'containers/AppPublic';
import AppPrivate from 'containers/AppPrivate';

import CMS from 'containers/CMS';
import Login from 'containers/Login';
import Items from 'containers/Items';
import NotFound from 'containers/NotFound';

export default function createRoutes() {
  return (
    <Route path="/" component={App}>
      <Route component={AppPublic}>
        <IndexRoute component={Items} onEnter={checkStatus} />
        <Route path="login" component={Login} onEnter={checkStatus} />
      </Route>
      <Route component={AppPrivate}>
        <Route path="cms" component={CMS} onEnter={checkStatus} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  );
}
