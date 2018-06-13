const MiddlewareFactory = require('../../libs/factories/MiddlewareFactory');
const path = require('path');
const config = require('../config');

MiddlewareFactory.register(
  'static',
  app => {
    config
      .getGlobbedFiles('./src/routes/**/*Routes.js')
      .forEach(routePath => require(path.resolve(routePath))(app));
  },
  MiddlewareFactory.EVENTS.EVENT_ROUTER
);
