'use strict';

const processConfig = require('./lib/processConfig');
const makeParsers = require('./lib/makeParsers');

module.exports = function configeur(schema, options = {}) {
  return processConfig(schema, options.env || process.env, makeParsers(options.parsers), options.mutable);
};

module.exports.default = module.exports;
