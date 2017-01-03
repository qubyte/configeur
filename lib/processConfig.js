'use strict';

function parse(value, parser) {
  if (typeof value !== 'string') {
    throw new Error(`Value to cast was not a string: ${value}`);
  }

  return parser(value);
}

module.exports = function processConfig(schema, env, parsers) {
  const config = new Map();
  const envNames = Object.getOwnPropertyNames(env);
  const missingRequiredProperties = [];

  for (const optionName of Object.keys(schema)) {
    const optionProperties = schema[optionName];
    const type = Object.prototype.hasOwnProperty.call(optionProperties, 'type') ? optionProperties.type : 'string';
    const parser = parsers.get(type);

    if (!parser) {
      throw new Error(`Unsupported config value type: ${type}`);
    }

    if (envNames.includes(optionName)) {
      config.set(optionName, parse(env[optionName], parser));
    } else if (!optionProperties.required) {
      config.set(optionName, parse(optionProperties.defaultValue, parser));
    } else {
      missingRequiredProperties.push(optionName);
    }
  }

  if (missingRequiredProperties.length) {
    throw new Error(`Missing required config for: ${missingRequiredProperties.join(', ')}`);
  }

  return config;
};
