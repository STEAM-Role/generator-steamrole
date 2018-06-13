'use strict';

const _ = require('lodash');
const crypto = require('crypto');
const Matcher = require('micromatch');
const constants = require('../config/acl.constants');

class ACLRule {
  constructor(rule) {
    validateRule(rule);
    sanitizeRulePermissions(rule.permissions);
    const matcher = Matcher.matcher(rule.resource + '(|/**)');

    this.resource = rule.resource;
    this.permissions = sortPermissions(rule.permissions);
    this.getMatcher = () => matcher;
  }

  validatePermission(roles, methods) {
    const permission = _.find(this.permissions, permission => {
      const foundedRole = _.intersection(permission.roles, roles).length || _.includes(permission.roles, '*');
      const foundedMethod = _.intersection(permission.methods, methods).length || _.includes(permission.methods, '*');
      return foundedRole && foundedMethod;
    });
    return permission;
  }

  isApplicable(resource, roles, methods) {
    return this.getMatcher()(resource) && this.validatePermission(roles, methods);
  }

  attachPermissions(permissions = []) {
    sanitizeRulePermissions(permissions);
    _.each(permissions, permission => {
      if (_.find(this.permissions, {hash: permission.hash})) return true;

      const similarPermission = _.first(getSimilarPermission(this.permissions, permission));

      if (similarPermission) {
        if (!_.includes(similarPermission.roles, '*')) {
          similarPermission.roles = _.union(similarPermission.roles, permission.roles);
        }
        return true;
      }

      this.permissions.push(permission);
    });
    this.permissions = sortPermissions(this.permissions);

  }
}
function md5(obj) {
  return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
}

function getSimilarPermission(source, target) {
  return _.filter(source, p => p.action === target.action && md5(p.methods) === md5(target.methods));
}

function sanitizeRulePermissions(permissions) {
  _.map(permissions, p => {
    if (_.isEmpty(p.roles)) throw new Error('Role must not be empty');
    if (!_.isString(p.roles) && !_.isArray(p.roles)) throw new Error('Role must be string or array');
    if (_.isEmpty(p.methods)) throw new Error('Methods must not be empty');
    if (!_.isString(p.methods) && !_.isArray(p.methods)) throw new Error('Methods must be string or array');
    if (_.isEmpty(p.action)) throw new Error('Action must not be empty');
    if (!_.isString(p.action)) throw new Error('Action must be string ');
    if (!constants[p.action]) throw new Error(`Action ${p.action} is not valid`);

    p.roles = _.isString(p.roles) ? [p.roles] : p.roles;
    p.action = constants[p.action];
    p.methods = _.isString(p.methods) ? [p.methods] : p.methods;
    p.hash = md5(p);
  });
}

function sortPermissions(permissions) {
  return _(permissions)
    .sortBy([sortByRole, sortByMethod])
    .reverse()
    .value();
}

function sortByRole(permission) {
  if (_.includes(permission.roles, '*')) return -999999;
  return _.size(permission.roles);
}

function sortByMethod(permission) {
  if (_.includes(permission.methods, '*')) return -999999;
  return _.size(permission.methods);
}

function validateRule(rule) {
  if (!_.isString(rule.resource) || !_.size(rule.resource)) {
    throw new Error('Resource missmatch or empty');
  }

  if (!_.isArray(rule.permissions) || !_.size(rule.permissions)) {
    throw new Error('Permissions must be an array or is empty');
  }
}

module.exports = ACLRule;
