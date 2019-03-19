'use strict';

const processConfig = require('./lib/process-config');
const makeParsers = require('./lib/make-parsers');

module.exports = function configeur(schema, options = {}) {
  return processConfig(schema, process.env, makeParsers(options.parsers), options.mutable);
};
