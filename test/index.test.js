'use strict';

const assert = require('assert');
const sinon = require('sinon');
const SandboxedModule = require('sandboxed-module');

describe('configeur', () => {
  let processConfigStub;
  let makeParsersStub;
  let configeur;

  beforeEach(() => {
    processConfigStub = sinon.stub();
    makeParsersStub = sinon.stub();

    processConfigStub.returns('fakeProcessedConfig');
    makeParsersStub.returns('fakeParsers');

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
    configeur('fakeSchema', { parsers: 'fake-custom-parsers', mutable: 'is-mutable' });

    assert.deepEqual(processConfigStub.args, [['fakeSchema', { AN_ARG: 'argValue' }, 'fakeParsers', 'is-mutable']]);
  });
});
