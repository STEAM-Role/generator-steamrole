'use strict';

const _ = require('lodash');
const ACLRule = require('./acl-rule.class');

class ACLRules {
  constructor(rules = []) {
    const root = new ACLRule({
      resource: '(|/|**)',
      permissions: [
        {
          roles: '*',
          action: 'deny',
          methods: '*'
        }
      ]
    });
    this.getRoot = () => root;

    this.rules = [root];
    this.parse(rules);
    this.rules = sortRules(this.rules);
  }

  validate(resource, role = ['anonymous'], method = ['*']) {
    return this.getApplicableRule(resource, role, method);
  }

  getApplicableRule(resource, roles, methods) {
    const rule = _.find(this.rules, rule => rule.isApplicable(resource, roles, methods));
    let permission;

    if (rule) {
      permission = rule.validatePermission(roles, methods);
    }

    return rule && {rule, permission};
  }

  parse(rules) {
    rules.forEach(rule => {
      const existedRule = this.findResource(rule.resource);
      if (existedRule) {
        existedRule.attachPermissions(rule.permissions);
        return true;
      }

      this.rules.push(new ACLRule(rule));
    });
  }

  findResource(resource) {
    if (resource === '$ROOT') return this.getRoot();
    return _.find(this.rules, {resource});
  }
}

function sortRules(rules) {
  return _.sortBy(rules, [rule => rule.resource.split('/')])
    .reverse();
}

module.exports = ACLRules;
