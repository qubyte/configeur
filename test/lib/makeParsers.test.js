'use strict';

const assert = require('assert');
const makeParsers = require('../../lib/makeParsers');
const defaultParsers = require('../../lib/defaultParsers');

describe('makeParsers', () => {
  it('is a function', () => {
    assert.equal(typeof makeParsers, 'function');
  });

  describe('when no additional parsers are given', () => {
    let parsers;

    beforeEach(() => {
      parsers = makeParsers();
    });

    it('returns a Map instance containing default parsers.', () => {
      assert.ok(parsers instanceof Map);
      assert.deepEqual([...parsers.entries()], defaultParsers);
    });
  });

  describe('when additional parsers are not given as an array', () => {
    it('throws an error', () => {
      assert.throws(
        () => makeParsers('blah'),
        err => err instanceof Error,
        'Additional parsers must be undefined or an array.'
      );
    });
  });

  describe('when a parser is not a string-function pair', () => {
    it('throws an error', () => {
      assert.throws(
        () => makeParsers(['no parser']), // Only parser name given.
        err => err instanceof Error,
        'Custom parsers must be arrays with name and parser as their two elements.'
      );

      assert.throws(
        () => makeParsers([undefined, () => {}]), // Only parser function given.
        err => err instanceof Error,
        'Custom parsers must be arrays with name and parser as their two elements.'
      );
    });
  });

  describe('when additional parsers are valid', () => {
    const replacementStringParser = () => {};
    const somethingParser = () => {};

    let parsers;

    beforeEach(() => {
      parsers = makeParsers([
        ['string', replacementStringParser],
        ['something', somethingParser]
      ]);
    });

    it('includes default parsers', () => {
      for (const [key, parser] of new Map(defaultParsers)) {
        if (key !== 'string') {
          assert.equal(parsers.get(key), parser);
        }
      }
    });

    it('includes additional parsers', () => {
      assert.equal(parsers.get('something'), somethingParser);
    });

    it('can be used to override built in parsers', () => {
      assert.equal(parsers.get('string'), replacementStringParser);
    });
  });
});
