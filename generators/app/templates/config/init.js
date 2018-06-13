'use strict';

const glob = require('glob');

function initialize() {
  const environmentFiles = glob('./config/env/' + process.env.NODE_ENV + '.js', {sync: true});

  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.log(
        '\x1b[31m',
        'No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'
      );
    } else {
      console.log('\x1b[31m', 'NODE_ENV is not defined! Using default development environment');
    }
    process.env.NODE_ENV = 'development';
  } else {
    console.log('\x1b[7m', 'Application loaded using the "' + process.env.NODE_ENV + '" environment configuration');
  }
  console.log('\x1b[0m');
}

module.exports = initialize;
