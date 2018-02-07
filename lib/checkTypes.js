'use strict';

module.exports = function checkTypes(parsers, schema) {
  for (const optionName of Object.keys(schema)) {
    const optionProperties = schema[optionName];
    const type = optionProperties.type || 'string';

    if (!parsers.get(type)) {
      throw new Error(`Unsupported config value type: ${type}`);
    }
  }
};
