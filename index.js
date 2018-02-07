'use strict';

const processConfig = require('./lib/processConfig');
const makeParsers = require('./lib/makeParsers');
const checkTypes = require('./lib/checkTypes');
const checkRequiredProperties = require('./lib/checkRequiredProperties');

module.exports = function configeur(schema, options = {}) {
  const parsers = makeParsers(options.parsers);

  checkTypes(parsers, schema);
  checkRequiredProperties(process.env, schema);

  const config = processConfig(schema, process.env, parsers);

  return options.mutable ? config : Object.freeze(config);
};

module.exports.default = module.exports;
