import { strict as assert } from 'assert';
import configeur from '../index.js';

describe('configeur', () => {
  const original = { ...process.env };

  afterEach(() => {
    // Remove all keys on process.env.
    for (const key of Object.keys(process.env)) {
      delete process.env[key];
    }

    // Return process.env to its original state.
    Object.assign(process.env, original);
  });

  it('is a function', () => {
    assert.equal(typeof configeur, 'function');
  });

  it('retuns an object with null prototype', () => {
    assert.deepEqual(configeur({}), Object.create(null));
  });

  it('parses config with built-in parsers', () => {
    const config = configeur({
      PORT: {
        defaultValue: '8000',
        type: 'number'
      }
    });

    assert.deepEqual(config, Object.assign(Object.create(null), {
      PORT: 8000
    }));
  });

  it('parses config with custom parsers', () => {
    const date = new Date();
    const config = configeur(
      {
        DATE: {
          defaultValue: date.toISOString(),
          type: 'date'
        }
      },
      {
        parsers: [['date', d => new Date(d)]]
      }
    );

    assert.deepEqual(config, Object.assign(Object.create(null), {
      DATE: date
    }));
  });

  it('throws when required config is not parsed in', () => {
    assert.throws(() => configeur(
      {
        PORT: {
          required: true,
          type: 'number'
        }
      }
    ), new Error('Missing required config for: PORT'));
  });
});
