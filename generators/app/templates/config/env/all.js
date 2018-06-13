'use strict';

module.exports = {
  port: process.env.PORT || 3000,
  templateEngine: 'pug',
  sessionSecret: process.env.SESSION_SECRET || '<%= sessionSecret %>',
  sessionCollection: 'sessions'
};
