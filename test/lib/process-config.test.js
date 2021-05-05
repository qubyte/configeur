import { strict as assert } from 'assert';
import defaultParsers from '../../lib/default-parsers.js';
import processConfig from '../../lib/process-config.js';

const parsers = new Map(defaultParsers);

function getOwnPropertyDescriptors(obj) {
  const descriptors = {};

  for (const key of Object.getOwnPropertyNames(obj)) {
    descriptors[key] = Object.getOwnPropertyDescriptor(obj, key);
  }

  return descriptors;
}

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

    it('uses defaults and returns a frozen prototypeless object with parsed values', () => {
      assert.deepStrictEqual(getOwnPropertyDescriptors(config), {
        OPTION_WITH_DEFAULT: { value: 'the-default', enumerable: true, writable: false, configurable: false },
        OPTION_IS_REQUIRED: { value: 10, enumerable: true, writable: false, configurable: false },
        ANOTHER_OPTION_IS_REQUIRED: { value: true, enumerable: true, writable: false, configurable: false }
      });
    });
  });

  describe('when missing required config', () => {
    it('throws an error with a list of missing required options', () => {
      assert.throws(
        () => processConfig(schema, {}, parsers),
        /Missing required config for: OPTION_IS_REQUIRED, ANOTHER_OPTION_IS_REQUIRED/
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

    it('uses the given optional config and returns a frozen prototypeless object with parsed values', () => {
      assert.deepStrictEqual(getOwnPropertyDescriptors(config), {
        OPTION_WITH_DEFAULT: { value: 'overridden', enumerable: true, writable: false, configurable: false },
        OPTION_IS_REQUIRED: { value: 10, enumerable: true, writable: false, configurable: false },
        ANOTHER_OPTION_IS_REQUIRED: { value: true, enumerable: true, writable: false, configurable: false }
      });
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
        /Value to cast for OPTION_WITH_DEFAULT was not a string: true/
      );
    });
  });

  describe('when given a type which does not correspond to a parser', () => {
    it('throws an error', () => {
      schema.OPTION_WITH_DEFAULT.type = 'blah';

      assert.throws(
        () => processConfig(schema, { OPTION_IS_REQUIRED: '10', ANOTHER_OPTION_IS_REQUIRED: 'true' }, parsers),
        /Unsupported config value type: blah/
      );
    });
  });

  describe('when configured to be mutable', () => {
    it('returns a mutable object', () => {
      const conf = processConfig(schema, { OPTION_IS_REQUIRED: '10', ANOTHER_OPTION_IS_REQUIRED: 'true' }, parsers, true);

      assert.doesNotThrow(() => {
        conf.OPTION_WITH_DEFAULT = 'hello';
      });

      assert.equal(conf.OPTION_WITH_DEFAULT, 'hello');
    });
  });
});
