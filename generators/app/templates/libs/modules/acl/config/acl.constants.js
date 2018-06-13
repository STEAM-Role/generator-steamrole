'use strict';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const DENY = Symbol('deny');
const ALLOW = Symbol('allow');

module.exports = {
  methods: HTTP_METHODS,
  deny: DENY,
  allow: ALLOW,
  defaultRole: 'anonymous'
};
