'use strict';

const assert = require('assert');
const defaultParsers = require('../../lib/default-parsers');

describe('defaultParsers', () => {
  it('is an array', () => {
    assert.ok(Array.isArray(defaultParsers));
  });

  it('contains parsers for "string", "boolean", "number", and "Array"', () => {
    const parserMap = new Map(defaultParsers);

    assert.equal(parserMap.size, 3);
    assert.equal(typeof parserMap.get('string'), 'function');
    assert.equal(typeof parserMap.get('boolean'), 'function');
    assert.equal(typeof parserMap.get('number'), 'function');
  });

  describe('string parser', () => {
    const parser = new Map(defaultParsers).get('string');

    it('returns the value passed to it', () => {
      assert.equal(parser('blah'), 'blah');
    });
  });

  describe('boolean parser', () => {
    const parser = new Map(defaultParsers).get('boolean');

    it('casts "true" to true', () => {
      assert.strictEqual(parser('true'), true);
    });

    it('casts "false" to false', () => {
      assert.strictEqual(parser('false'), false);
    });

    it('casts other strings to false', () => {
      assert.strictEqual(parser('blah'), false);
    });
  });

  describe('number parser', () => {
    const parser = new Map(defaultParsers).get('number');

    it('casts to number', () => {
      assert.strictEqual(parser('10'), 10);
      assert.strictEqual(parser('10.1'), 10.1);
      assert.ok(Number.isNaN(parser('blah')));
    });
  });
});
