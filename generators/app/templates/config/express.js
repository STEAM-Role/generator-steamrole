'use strict';

const express = require('express');
const MiddlewareFactory = require('../libs/factories/MiddlewareFactory');
const _ = require('lodash');
const config = require('./config');
const path = require('path');

function expressConfig(mongodbConnection) {
  const app = express();
  config
    .getGlobbedFiles('./config/settings/**/*.middleware.js')
    .forEach(routePath => require(path.resolve(routePath)));
  _.each(MiddlewareFactory.EVENTS_PRIORITY, event => MiddlewareFactory.execute(event, app, mongodbConnection));
  return app;
}

module.exports = expressConfig;
