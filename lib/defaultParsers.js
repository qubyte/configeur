'use strict';

module.exports = [
  ['string', value => value],
  ['boolean', value => value === 'true'],
  ['number', Number]
];
