import React from 'react';
import { Route } from 'react-router';
import AppHandler from 'handlers/app';
import WatchHandler from 'handlers/watch';
import RecordHandler from 'handlers/record';
import SubmitHandler from 'handlers/submit';

function onEnterSubmit(nextState, replace) {
  if (!nextState.location.state || !(nextState.location.state.video instanceof global.Blob)) {
    replace('/');
  }
}

export default (
  <Route path="/" component={AppHandler}>
    <Route path="watch/:id" component={WatchHandler} />
    <Route path="record" component={RecordHandler} />
    <Route path="submit" component={SubmitHandler} onEnter={onEnterSubmit} />
  </Route>
);
