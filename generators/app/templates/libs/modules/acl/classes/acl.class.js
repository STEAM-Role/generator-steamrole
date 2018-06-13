'use strict';

const _ = require('lodash');
const ACLRules = require('./acl-rules.class');
const ACLConstants = require('../config/acl.constants');
const rules = require('../config/acl.json');

class ACL {
  constructor() {
    const parsedRules = new ACLRules(rules);
    this.getRules = () => parsedRules;
  }

  sanitizeResource(resource) {
    return _.chain(resource)
      .trim()
      .trim('/')
      .thru(sanitizedResource => sanitizedResource)
      .value();
  }

  sanitizeRoles(roles) {
    return roles || [ACLConstants.defaultRole];
  }

  sanitizeMethod(method) {
    return [method];
  }

  hasAuthorization(resource, roles, method) {
    resource = this.sanitizeResource(resource);
    roles = this.sanitizeRoles(roles);
    method = this.sanitizeMethod(method);
    const foundRule = this.getRules().validate(resource, roles, method);
    return _.get(foundRule, 'permission.action', ACLConstants.deny) === ACLConstants.allow;
  }
}

module.exports = ACL;
