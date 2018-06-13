'use strict';

module.exports = {
  db: process.env.MONGO_URL || 'mongodb://localhost/<%= appname %>-dev'
};
