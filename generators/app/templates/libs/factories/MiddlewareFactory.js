'use strict';

const _ = require('lodash');
const middlewares = {};

const EVENT_COMMONS= 'commons';
const EVENT_SECURITY= 'security';
const EVENT_PRE_ROUTER= 'pre:router';
const EVENT_ROUTER= 'router';
const EVENT_AFTER_ROUTER= 'after:router';
const EVENT_PRE_ERROR= 'pre:error-handler';
const EVENT_ERROR= 'error-handler';
const EVENT_AFTER_ERROR= 'after:error-handler';

const EVENTS_PRIORITY= [
  EVENT_COMMONS,
  EVENT_SECURITY,
  EVENT_PRE_ROUTER,
  EVENT_ROUTER,
  EVENT_AFTER_ROUTER,
  EVENT_PRE_ERROR,
  EVENT_ERROR,
  EVENT_AFTER_ERROR
];

const EVENTS = {
  EVENT_COMMONS,
  EVENT_SECURITY,
  EVENT_PRE_ROUTER,
  EVENT_ROUTER,
  EVENT_AFTER_ROUTER,
  EVENT_PRE_ERROR,
  EVENT_ERROR,
  EVENT_AFTER_ERROR
};

_.each(EVENTS_PRIORITY, e => middlewares[e] = _.size(middlewares[e])? middlewares[e] : []);

class MiddlewareFactory {
  static register(name, module, event, priority = -1) {
    validateModule(name, module, event);
    middlewares[event].push({ name, module, priority });
  }

  static execute(event, server, databaseConnector) {
    if (!event || !_.includes(EVENTS, event)) throw new Error('Event name is not valid');
    _.chain(middlewares[event])
      .orderBy(['priority'], ['asc'])
      .forEach(m => m.module.call(m,server, databaseConnector))
      .commit();
  }
}

function validateModule(name, module, event) {
  if (!name || !_.isString(name)) throw new Error('Module Name is undefined or not a value');
  if (!module || !_.isFunction(module)) throw new Error('Module constructor is not valid');
  if (!event || !_.includes(EVENTS, event)) throw new Error('Event name is not valid');
}

module.exports = MiddlewareFactory;
module.exports.EVENTS = EVENTS;
module.exports.EVENTS_PRIORITY = EVENTS_PRIORITY;
