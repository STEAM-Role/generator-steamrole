const MiddlewareFactory = require('../../libs/factories/MiddlewareFactory');
const express = require('express');
const path = require('path');

MiddlewareFactory.register(
  'static',
  app => {
    app.use(express.static(path.resolve('./public')));
    app.use('/docs', express.static(path.resolve('./docs')));
  },
  MiddlewareFactory.EVENTS.EVENT_PRE_ROUTER
);
