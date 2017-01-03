'use strict';

const assert = require('assert');
const parsers = new Map(require('../../lib/defaultParsers'));
const processConfig = require('../../lib/processConfig');

describe('processConfig', () => {
  let schema;
  let config;

  beforeEach(() => {
    schema = {
      optionWithDefault: {
        defaultValue: 'the-default',
        envVariableName: 'OPTION_WITH_DEFAULT',
        type: 'string'
      },
      optionIsRequired: {
        required: true,
        envVariableName: 'OPTION_IS_REQUIRED',
        type: 'number'
      },
      anotherOptionIsRequired: {
        required: true,
        envVariableName: 'ANOTHER_OPTION_IS_REQUIRED',
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
      assert.equal(config.get('optionWithDefault'), 'the-default');
      assert.strictEqual(config.get('optionIsRequired'), 10);
      assert.strictEqual(config.get('anotherOptionIsRequired'), true);
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
      assert.equal(config.get('optionWithDefault'), 'overridden');
      assert.strictEqual(config.get('optionIsRequired'), 10);
      assert.strictEqual(config.get('anotherOptionIsRequired'), true);
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
      schema.optionWithDefault.type = 'blah';

      assert.throws(
        () => processConfig(schema, { OPTION_IS_REQUIRED: '10', ANOTHER_OPTION_IS_REQUIRED: 'true' }, parsers),
        err => err instanceof Error,
        'Unsupported config value type: blah'
      );
    });
  });
});
