'use strict';
//bootstrap
const mongoose = require('mongoose');
const path = require('path');
mongoose.Promise = require('bluebird');

//:initialize
require('./config/init')();
require('./config/mongoose-types');
require('./config/mongoose-plugins');

//:config
const config = require('./config/config');

const expressInit = require('./config/express');
module.exports = init();

async function init() {
  const db = await mongoose.connect(config.db);
  config.getGlobbedFiles('./src/models/**/*.js').forEach(modelPath => require(path.resolve(modelPath)));
  const app = expressInit(db);
  app.listen(config.port);
  console.log('Server started on port ' + config.port);
  return app;
}
