'use strict';

const mongoose = require('mongoose');

require('mongoose-type-email');
require('mongoose-type-url');
require('mongoose-currency').loadType(mongoose);
require('mongoose-double')(mongoose);
require('mongoose-float').loadType(mongoose);
