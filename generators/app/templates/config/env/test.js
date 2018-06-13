'use strict';

module.exports = {
  db: process.env.MONGO_TEST_URL || 'mongodb://localhost/<%= appname %>-test',
  port: 3001
};
