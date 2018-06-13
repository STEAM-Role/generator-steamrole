'use strict';

module.exports = {
  db: process.env.MONGO_URL || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/<%= appname %>',
};
