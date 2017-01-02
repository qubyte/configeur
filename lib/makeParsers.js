'use strict';

const defaultParsers = require('./defaultParsers');

function checkValidParserSpec(spec) {
  return Array.isArray(spec) && spec.length === 2 && typeof spec[0] === 'string' && typeof spec[1] === 'function';
}

module.exports = function makeParsers(additional) {
  if (additional === undefined) {
    return new Map(defaultParsers);
  }

  if (!Array.isArray(additional)) {
    throw new Error('Additional parsers must be undefined or an array.');
  }

  if (!additional.every(checkValidParserSpec)) {
    throw new Error('Custom parsers must be arrays with name and parser as their two elements.');
  }

  return new Map(defaultParsers.concat(additional));
};
