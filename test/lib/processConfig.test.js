'use strict';

const assert = require('assert');
const parsers = new Map(require('../../lib/defaultParsers'));
const processConfig = require('../../lib/processConfig');

describe('processConfig', () => {
  let schema;
  let config;

  beforeEach(() => {
    schema = {
      OPTION_WITH_DEFAULT: {
        defaultValue: 'the-default',
        type: 'string'
      },
      OPTION_IS_REQUIRED: {
        required: true,
        type: 'number'
      },
      ANOTHER_OPTION_IS_REQUIRED: {
        required: true,
        type: 'boolean'
      }
    };
  });

  it('is a function', () => {
    assert.equal(typeof processConfig, 'function');
  });

  describe('when missing optional config', () => {
    beforeEach(() => {
      config = processConfig(schema, { OPTION_IS_REQUIRED: '10', ANOTHER_OPTION_IS_REQUIRED: 'true' }, parsers);
    });

    it('uses defaults and returns a map with parsed values', () => {
      assert.ok(config instanceof Map);
      assert.equal(config.size, 3);
      assert.equal(config.get('OPTION_WITH_DEFAULT'), 'the-default');
      assert.strictEqual(config.get('OPTION_IS_REQUIRED'), 10);
      assert.strictEqual(config.get('ANOTHER_OPTION_IS_REQUIRED'), true);
    });
  });

  describe('when missing required config', () => {
    it('throws an error with a list of missing required options', () => {
      assert.throws(
        () => processConfig(schema, {}, parsers),
        err => err instanceof Error,
        'Missing required config for: optionIsRequired, anotherOptionIsRequired'
      );
    });
  });

  describe('when optional config is available', () => {
    beforeEach(() => {
      config = processConfig(schema, {
        OPTION_WITH_DEFAULT: 'overridden',
        OPTION_IS_REQUIRED: '10',
        ANOTHER_OPTION_IS_REQUIRED: 'true'
      }, parsers);
    });

    it('uses the given optional config and returns a map with parsed values', () => {
      assert.ok(config instanceof Map);
      assert.equal(config.size, 3);
      assert.equal(config.get('OPTION_WITH_DEFAULT'), 'overridden');
      assert.strictEqual(config.get('OPTION_IS_REQUIRED'), 10);
      assert.strictEqual(config.get('ANOTHER_OPTION_IS_REQUIRED'), true);
    });
  });

  describe('when given a value which is not a string', () => {
    it('throws an error', () => {
      assert.throws(
        () => processConfig(schema, {
          OPTION_WITH_DEFAULT: true,
          OPTION_IS_REQUIRED: '10',
          ANOTHER_OPTION_IS_REQUIRED: 'true'
        }, parsers),
        err => err instanceof Error,
        'Value to cast was not a string: true'
      );
    });
  });

  describe('when given a type which does not correspond to a parser', () => {
    it('throws an error', () => {
      schema.OPTION_WITH_DEFAULT.type = 'blah';

      assert.throws(
        () => processConfig(schema, { OPTION_IS_REQUIRED: '10', ANOTHER_OPTION_IS_REQUIRED: 'true' }, parsers),
        err => err instanceof Error,
        'Unsupported config value type: blah'
      );
    });
  });
});
