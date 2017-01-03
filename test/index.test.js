'use strict';

const assert = require('assert');
const sinon = require('sinon');
const SandboxedModule = require('sandboxed-module');

describe('configeur', () => {
  const sandbox = sinon.sandbox.create();
  const processConfigStub = sandbox.stub();
  const makeParsersStub = sandbox.stub();

  processConfigStub.returns('fakeProcessedConfig');
  makeParsersStub.returns('fakeParsers');

  let configeur;

  before(() => {
    configeur = SandboxedModule.require('../index', {
      requires: {
        './lib/processConfig': processConfigStub,
        './lib/makeParsers': makeParsersStub
      },
      globals: {
        process: {
          env: { AN_ARG: 'argValue' }
        }
      }
    });
  });

  afterEach(() => {
    sandbox.reset();
  });

  it('is a function', () => {
    assert.strictEqual(typeof configeur, 'function');
  });

  it('returns a config map', () => {
    assert.strictEqual(configeur('fakeSchema'), 'fakeProcessedConfig');
  });

  it('makes a parsers map with the parsers option', () => {
    configeur('fakeSchema', { parsers: 'fake-custom-parsers' });

    assert.deepEqual(makeParsersStub.args, [['fake-custom-parsers']]);
  });

  it('passes the schema, the environment, and the parsers to processConfig', () => {
    configeur('fakeSchema', { parsers: 'fake-custom-parsers' });

    assert.deepEqual(processConfigStub.args, [['fakeSchema', { AN_ARG: 'argValue' }, 'fakeParsers']]);
  });
});
