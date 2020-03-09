const Joi = require('@hapi/joi');

module.exports = Joi.extend(joi => ({
  type: 'object',
  base: joi.object(),
  coerce: (value) => {
    if (typeof value === 'string') {
      if (value[0] !== '{' && !/^\s*\{/.test(value)) {
        return;
      }

      try {
        // eslint-disable-next-line consistent-return
        return { value: JSON.parse(value) };
      // eslint-disable-next-line no-empty
      } catch (ignoreErr) {}
    }
  },
})).extend(joi => ({
  type: 'array',
  base: joi.array(),
  coerce: (value) => {
    // eslint-disable-next-line no-mixed-operators
    if (typeof value !== 'string' || value[0] !== '[' && !/^\s*\[/.test(value)) {
      return;
    }

    try {
      // eslint-disable-next-line consistent-return
      return { value: JSON.parse(value) };
    // eslint-disable-next-line no-empty
    } catch (ignoreErr) {}
  },
})).defaults((schema) => {
  switch (schema.type) {
    case 'string':
      return schema.allow('');
    default:
      return schema;
  }
});
