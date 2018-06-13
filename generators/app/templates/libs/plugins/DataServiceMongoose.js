'use strict';

const DataService = require('../classes/DataServiceClass');

function withQS(queryString) {
  this.dataService.setQueryString(queryString);
  return this;
}

function getFilter(queryString) {
  return this.dataService.buildFilter(queryString);
}

module.exports = function(schema) {
  schema.static('withQS', withQS);
  schema.static('getFilter', getFilter);
  schema.static('dataService', new DataService(schema));

};
