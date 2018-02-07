'use strict';

const assert = require('assert');
const SandboxedModule = require('sandboxed-module');

const env = {};
const configeur = SandboxedModule.require('../index', {
  globals: {
    process: {
      env
    }
  }
});

describe('configeur', () => {
  let schema;

  beforeEach(() => {
    for (const name of Object.getOwnPropertyNames(env)) {
      delete env[name];
    }

    env.AN_ARG = 'Hello, world!';

    schema = {
      AN_ARG: {
        type: 'string',
        required: true
      },
      ANOTHER_ARG: {
        type: 'number',
        defaultValue: '123'
      }
    };
  });

  it('is a function', () => {
    assert.strictEqual(typeof configeur, 'function');
  });

  it('re-exports itself as default', () => {
    assert.equal(configeur.default, configeur);
  });

  it('returns a frozen prototypeless object when mutable is falsy', () => {
    const config = configeur(schema);

    assert.strictEqual(Object.getPrototypeOf(config), null);
    assert.ok(Object.isFrozen(config));
    assert.deepStrictEqual(Object.assign({}, config), {
      AN_ARG: 'Hello, world!',
      ANOTHER_ARG: 123
    });
  });

  it('returns a non-frozen prototypeless object when mutable is truthy', () => {
    const config = configeur(schema, { mutable: true });

    assert.strictEqual(Object.getPrototypeOf(config), null);
    assert.ok(!Object.isFrozen(config));
    assert.deepStrictEqual(Object.assign({}, config), {
      AN_ARG: 'Hello, world!',
      ANOTHER_ARG: 123
    });
  });

  it('provides parsers for strings (default), numbers, and booleans', () => {
    const schema = {
      A: { defaultValue: 'blah' },
      B: { type: 'string', defaultValue: 'bleh' },
      C: { type: 'number', defaultValue: '123' },
      D: { type: 'boolean', defaultValue: 'true' }
    };

    const fine = configeur(schema);

    assert.deepStrictEqual(Object.assign({}, fine), { A: 'blah', B: 'bleh', C: 123, D: true });
  });

  it('allows additional parsers to be provided', () => {
    const schema = {
      A: { defaultValue: 'blah' },
      B: { type: 'string', defaultValue: 'bleh' },
      C: { type: 'number', defaultValue: '123' },
      D: { type: 'boolean', defaultValue: 'true' },
      E: { type: 'custom', defaultValue: 'flop' }
    };

    const parsers = [
      ['custom', () => 'flop']
    ];

    const fine = configeur(schema, { parsers });

    assert.deepStrictEqual(Object.assign({}, fine), { A: 'blah', B: 'bleh', C: 123, D: true, E: 'flop' });
  });

  it('checks for invalid parser types', () => {
    const schema = {
      A: { defaultValue: 'blah' },
      B: { type: 'string', defaultValue: 'bleh' },
      C: { type: 'number', defaultValue: '123' },
      D: { type: 'boolean', defaultValue: 'true' },
      E: { type: 'custom', defaultValue: 'flop' },
      F: { type: 'non-existent', defaultValue: 'uh oh' }
    };

    const parsers = [
      ['custom', () => 'flop']
    ];

    assert.throws(
      () => configeur(schema, { parsers }),
      err => err.message === 'Unsupported config value type: non-existent'
    );
  });

  it('lists missing required options in a thrown error', () => {
    const schema = {
      A: { required: true },
      AN_ARG: { required: true },
      C: { required: true },
      D: { defaultValue: 'blah' }
    };

    assert.throws(
      () => configeur(schema),
      err => {
        const [x, y, ...z] = err.missingRequiredProperties;
        return err instanceof Error && z.length === 0 && x === 'A' && y === 'C';
      }
    );
  });

  it('throws an error when an environment property is not a string', () => {
    env.ANOTHER_ARG = 123;

    assert.throws(
      () => configeur(schema),
      err => err instanceof Error && err.message === 'Value to cast for ANOTHER_ARG was not a string: 123'
    );
  });
});
