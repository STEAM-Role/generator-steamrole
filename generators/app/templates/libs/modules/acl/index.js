'use strict';

const _ = require('lodash');
const ACL = require('./classes/acl.class');
const DEFAULT_SETTINGS = {
  userProperty: 'user',
  rolesProperty: 'roles'
};
let aclInstance;


class ACLMiddleware {
  constructor(customOptions = {}) {
    const options = Object.assign({}, DEFAULT_SETTINGS, customOptions);
    const acl = new ACL();

    this.getOptions = () => options;
    this.getACL = () => acl;
  }

  static authorize(req, res, next) {
    const options = aclInstance.getOptions();
    const userProperty = `${options.userProperty}.${options.rolesProperty}`;
    const hasAuthorization = aclInstance.getACL().hasAuthorization(req.path, _.get(req, userProperty), req.method);
    if (!hasAuthorization) return res.status(401).send('Unauthorized Resource');
    next();
  }

  static initialize(options = {}) {
    let error = false;
    try {
      aclInstance = new ACLMiddleware(options);
    } catch (e) {
      error = e;
    }
    Object.freeze(aclInstance);
    return (req, res, next) => { error ? res.status(400).send(error.message) : next(); };
  }
}

module.exports = ACLMiddleware;
