
'use strict';

const express = require('express');
const _ = require('lodash');


class Router {
  constructor(mounter, mountPoint = '/') {
    const router = express.Router();
    this.getRouter = () => router;
    this.getMountPoint = () => mountPoint;

    if (mounter) this.endpoints(mounter);
  }

  mount(parentRouter) {
    parentRouter.use(this.getMountPoint(), this.getRouter());
    return this;
  }

  subrouter(subroute) {
    subroute.mount(this.getRouter());
    return this;
  }

  endpoints(mounter = _.noop) {
    if (!_.isFunction(mounter)) mounter = _.noop;
    mounter.call(this, this.getRouter());
    return this;
  }
}

module.exports = Router;
