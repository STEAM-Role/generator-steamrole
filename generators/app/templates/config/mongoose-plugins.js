'use strict';

const mongoose = require('mongoose');
mongoose.plugin(require('../libs/plugins/DataServiceMongoose'));
mongoose.plugin(require('../libs/plugins/PaginateMongoose'));
