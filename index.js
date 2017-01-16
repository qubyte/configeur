'use strict';

const processConfig = require('./lib/processConfig');
const makeParsers = require('./lib/makeParsers');

module.exports = function configeur(schema, options = {}) {
  return processConfig(schema, process.env, makeParsers(options.parsers));
};

module.exports.default = module.exports;
