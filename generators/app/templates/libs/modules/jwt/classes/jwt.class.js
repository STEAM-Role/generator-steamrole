'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const DEFAULTS = require('../configs/defaults.json');
const JWTException = require('./jwt-exception.class');

class JWT {
  constructor(cutomOptions = {}, req = {}) {
    const request = req;
    const options = Object.assign({}, cutomOptions, DEFAULTS);

    this.user = null;
    this.decoded = null;
    this.isValid = false;
    this.getRequest = () => request;
    this.getOptions = () => options;
  }

  getTokenFromHeaders() {
    const token = this.getRequest().headers[this.getOptions().header];
    return token;
  }

  async decorate(req) {
    req.jwt = this;
    /**
     * Add next line when move from sessions to jwt.
     * req.user = null;
     * @type {null}
     */

    await this.build();
    //overwrite session login only when JWT user found
    if (this.user) {
      SteamRole.logger.debug(`
        ===== JWT =====
        Action: Overwritte req.user with ${req.jwt.user.displayName}
        ===============
        `);
      req.user = this.user;
    }
  }

  reset() {
    this.user = null;
    this.decoded = null;
    this.isValid = false;
  }

  async build() {
    try {
      const User = mongoose.model('User');
      const storeToken = await getToken(this.getTokenFromHeaders());
      const {secret, audience, issuer} = this.getOptions();

      if (!_.get(storeToken, 'isValid', false)) throw new JWTException('Invalid Token provided');

      this.decoded = jwt.verify(storeToken.token, secret, {audience, issuer});
      this.user = await User.findById(this.decoded.userId, '-providerData -additionalProvidersData -salt -password');
      this.isValid = true;

      SteamRole.logger.debug(`
        ===== JWT =====
        Token: ${storeToken.token}
        Decoded: ${JSON.stringify(this.decoded, null, 2)}
        User:  ${JSON.stringify(this.user, null, 2)}
        ===============
        `);
    } catch (e) {
      this.isValid = false;
    }
  }

  async logout() {
    const storedToken = await getToken(this.getTokenFromHeaders());
    if (!_.get(storedToken, 'isValid', false)) return false;
    await invalidateToken(storedToken);
    this.reset();
  }

  async login(userPayload) {
    const {secret, audience, issuer} = this.getOptions();
    const validToken = await getValidToken(userPayload.userId);

    if (validToken) return transformToken(validToken);

    const token = jwt.sign(userPayload, secret, {audience, issuer});
    const storedToken = await storeToken(userPayload.userId, token);
    return transformToken(storedToken);
  }
}

/** Private Methods **/
async function getToken(token) {
  const Token = mongoose.model('Token');
  return await Token.findOne({token, isValid: true}).exec();
}

function transformToken(token) {
  return _.get(token.toJSON(), 'token');
}

async function getValidToken(userId) {
  const Token = mongoose.model('Token');
  return await Token.findOne({
    user: userId,
    isValid: true
  });
}

async function invalidateToken(token) {
  if (!token) return false;
  return await token.update({isValid: false});
}

async function storeToken(userId, token) {
  const Token = mongoose.model('Token');
  const tokenInstance = new Token({user: userId, token});
  return await tokenInstance.save();
}

module.exports = JWT;
