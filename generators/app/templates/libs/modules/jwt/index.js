'use strict';

const JWT = require('./classes/jwt.class');

class JWTMiddleware {
  static initialize(options = {}) {
    return async(req, res, next) => {
      try {
        const jwt = new JWT(options, req);
        await jwt.decorate(req);
        Object.seal(req.jwt);
      } finally {
        next();
      }
    };
  }
}

module.exports = JWTMiddleware;
