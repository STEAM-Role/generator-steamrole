'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const glob = require('glob');
const slugify = require('slugify');
const rs = require('randomstring');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Add option to skip install
    this.option('skip-install');

    this.slugify = slugify;
    this.sessionSecret = rs.generate();
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the ace ${chalk.red('generator-steamrole')} microservice generator!`
      )
    );
  }

  dir() {
    if (this.options.createDirectory !== undefined) {
      return true;
    }

    const prompt = [
      {
        type: 'confirm',
        name: 'createDirectory',
        message: 'Would you like to create a new directory for your SaaS?'
      }
    ];

    return this.prompt(prompt).then(response => {
      this.options.createDirectory = response.createDirectory;
    });
  }

  dirname() {
    if (!this.options.createDirectory || this.options.dirname) {
      return true;
    }

    const prompt = [
      {
        type: 'input',
        name: 'dirname',
        message: 'Enter directory name'
      }
    ];

    return this.prompt(prompt).then(response => {
      this.options.dirname = response.dirname;
    });
  }

  writing() {
    if (this.options.createDirectory) {
      this.destinationRoot(this.options.dirname);
      this.appname = slugify(this.options.dirname);
    }

    this.fs.copyTpl(this.templatePath('.'), this.destinationPath('.'), this);
    glob.sync('.*', { cwd: this.sourceRoot(), dot:true }).forEach((file) => {
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), this);
    });

  }

  install() {
    this.installDependencies({npm: true, bower: false});
  }
};
