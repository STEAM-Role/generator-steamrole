'use strict';

const {Schema} = require('mongoose');

class SchemaFactory {
  static build(fields, options) {
    const schema = new Schema(fields, options);
    schema.set('toObject', { virtuals: true, getters: true });
    schema.set('toJSON', { virtuals: true, getters: true });
    return schema;
  }
}

module.exports = SchemaFactory;
