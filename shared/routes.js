import React from 'react';
import { Route } from 'react-router';
import AppHandler from 'handlers/app';
import WatchHandler from 'handlers/watch';

export default (
  <Route path="/" component={AppHandler}>
    <Route path="watch/:id" component={WatchHandler} />
  </Route>
);
