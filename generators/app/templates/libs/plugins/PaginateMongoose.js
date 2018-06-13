'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const defaultOptions = {
  page: 1,
  limit: 50,
  resultProperty: 'docs',
  criteriaProperty: 'criteria',
  flattened: false
};

async function paginate(query = {}, options = {}, callback = undefined) {
  const schemaConfig = this.dataService.getConfig();
  options = _.assign({}, defaultOptions, schemaConfig.pagination, options);
  options.limit = options.limit || defaultOptions.limit;
  options.lean = options.lean || false;
  options.page = options.page || 1;
  options.limit = options.limit || 50;
  options.skip = (options.page - 1) * options.limit;
  options.populate = options.populate || [];

  const queryDocs = this.find(query)
    .select(options.select)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit)
    .lean(options.lean);

  if (options.populate) {
    [].concat(options.populate).forEach(item => {
      queryDocs.populate(item);
    });
  }

  const promises = [
    queryDocs.exec(),
    this.count(query)
  ];

  const [docs, count] = await Promise.all(promises);

  if (options.flattened) return docs;

  const result = {};
  const criteria = {};

  criteria.total = count;
  criteria.page = options.page;
  criteria.pages = Math.ceil(count / options.limit);
  criteria.limit = options.limit;
  criteria.skip = options.skip;

  result[options.resultProperty] = docs;
  result[options.criteriaProperty] = criteria;

  if (_.isFunction(callback)) callback(result);

  return result;
}


module.exports = function(schema) {
  schema.static('paginate', paginate);
};
