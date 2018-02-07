'use strict';

function checkAndParseOption(optionName, schema, env, parsers) {
  const { type, defaultValue } = schema[optionName];
  const parser = parsers.get(type || 'string');
  const value = env[optionName] || defaultValue;

  if (typeof value !== 'string') {
    throw new Error(`Value to cast for ${optionName} was not a string: ${value}`);
  }

  return parser(value);
}

module.exports = function processConfig(schema, env, parsers) {
  const config = Object.create(null);

  for (const optionName of Object.keys(schema)) {
    config[optionName] = checkAndParseOption(optionName, schema, env, parsers);
  }

  return config;
};
