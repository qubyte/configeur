'use strict';

function parse(name, value, parsers, optionProperties) {
  const type = Object.prototype.hasOwnProperty.call(optionProperties, 'type') ? optionProperties.type : 'string';
  const parser = parsers.get(type);

  if (!parser) {
    throw new Error(`Unsupported config value type: ${type}`);
  }

  if (typeof value !== 'string') {
    throw new Error(`Value to cast for ${name} was not a string: ${value}`);
  }

  return parser(value);
}

module.exports = function processConfig(schema, env, parsers, mutable) {
  const config = Object.create(null);
  const envNames = Object.getOwnPropertyNames(env);
  const missingRequiredProperties = [];

  for (const [optionName, optionProperties] of Object.entries(schema)) {
    if (envNames.includes(optionName)) {
      config[optionName] = parse(optionName, env[optionName], parsers, optionProperties);
    } else if (!optionProperties.required) {
      config[optionName] = parse(optionName, optionProperties.defaultValue, parsers, optionProperties);
    } else {
      missingRequiredProperties.push(optionName);
    }
  }

  if (missingRequiredProperties.length) {
    throw new Error(`Missing required config for: ${missingRequiredProperties.join(', ')}`);
  }

  return mutable ? config : Object.freeze(config);
};
