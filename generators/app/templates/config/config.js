'use strict';

const _ = require('lodash');
const glob = require('glob');

module.exports = _.extend(require('./env/all'), require('./env/' + process.env.NODE_ENV) || {});

module.exports.getGlobbedFiles = (globPatterns, removeRoot) => {
  if (_.isArray(globPatterns)) return globPatterns.transform((result, globPattern) =>
    _.union(result, this.getGlobbedFiles(globPattern, removeRoot)), []);

  const files = glob(globPatterns, { sync: true });
  if (removeRoot) {
    return files.map(file => file.replace(removeRoot, ''));
  }

  return files;
};
