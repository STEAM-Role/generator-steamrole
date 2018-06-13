'use strict';

const mongoose = require('mongoose');

class Controller {
  constructor(modelName) {
    const model = mongoose.model(modelName);
    this.getModel = () => model;
  }

  getFilterFromQS(req) {
    return this.getModel()
      .withQS(req.query)
      .getFilter();
  }

  async getById(req, res) {}

  async create(req, res) {}

  async read(req, res, next) {
    try {
      const query = this.getFilterFromQS(req);
      res.json(await this.getModel().paginate(query));
    } catch (e) {
      next(e);
    }
  }

  async update(req, res) {}

  async delete(req, res) {}

  use(method) {
    return method.bind(this);
  }

}

module.exports = Controller;
