'use strict';

const _ = require('lodash');
const { parseQuery } = require('rql/parser');
const mongoRQL = require('mongo-rql');

const Constants = require('../constants/constants');

class DataServiceClass {
  constructor(schema) {
    schema.set('dataservice', Object.assign({}, Constants.DATA_SERVICE, (schema.get('dataservice') || {})));

    this.query = {};
    this.getConfig = () => schema.get('dataservice');
  }

  setQueryString(queryString = {}) {
    this.query = queryString;
  }

  buildFilter(queryString) {
    queryString = queryString || this.query;
    const rql = parseQuery(_.get(queryString, this.getConfig().fields.filter), '');
    const mongoQuery = mongoRQL(rql);
    return _.get(mongoQuery, 'criteria', {});
  }
}

module.exports = DataServiceClass;
