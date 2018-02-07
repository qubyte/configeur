'use strict';

module.exports = function checkRequiredProperties(env, schema) {
  const missingRequiredProperties = [];

  for (const optionName of Object.keys(schema)) {
    if (schema[optionName].required && typeof env[optionName] !== 'string') {
      missingRequiredProperties.push(optionName);
    }
  }

  if (missingRequiredProperties.length) {
    const error = new Error(`Missing required config for: ${missingRequiredProperties.join(', ')}`);
    error.missingRequiredProperties = missingRequiredProperties;
    throw error;
  }
};
