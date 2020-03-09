const Model = require('../utils/joiExtensions');
const geocoder = require('../utils/geocode');

const parseSchema = (model, schema, parent) => {
  if (!Model.isSchema(model) && model.type === 'object') throw Error('The provided model is not a Joi object');

  model.$_terms.metas
    .map(meta => parseMeta(schema, model, meta, parent));
  model.$_terms.keys.forEach(field => parseField(field, schema, parent));
  return schema;
};

const parseMeta = (schema, field, {
  component, type, inherits, _mongoose,
}, parent) => {
  if (_mongoose) {
    const { virtuals, ...options } = _mongoose;

    if (virtuals) {
      if (parent) {
        const key = `${parent}.${field.key}`;
        schema.remove(key);
        schema.virtual(key, options);
      } else {
        schema.remove(field.key);
        schema.virtual(field.key, options);
      }
      // delete schema.obj[field];
      // delete schema.tree[field];
      schema.set('toJSON', { virtuals: true });
    }
  }

  switch (type) {
    case 'geo':
      schema.index({ location: '2dsphere' });
      // workaround for https://github.com/Automattic/mongoose/issues/964
      schema.pre('save', async function geocode(next) {
        if (this.address && this.address.street) {
          const payload = {
            address: `${this.address.street} ${this.address.number || ''}`,
          };
          if (this.address.city) payload.city = this.address.city;
          if (this.address.zipcode) payload.zipcode = this.address.zipcode;
          try {
            this.location = await geocoder.geocode(payload);
          } catch (err) {
            console.log('Error geocoding:', err);
          }
        }

        next();
      });

      schema.pre('findOneAndUpdate', async function geocode(next) {
        if (this._update.address && this._update.address.street) {
          const payload = {
            address: `${this._update.address.street} ${this._update.address.number || ''}`,
          };
          if (this._update.address.city) payload.city = this._update.address.city;
          if (this._update.address.zipcode) payload.zipcode = this._update.address.zipcode;
          try {
            const location = await geocoder.geocode(payload);
            this._update.location = location;
          } catch (err) {
            console.log('Error geocoding:', err);
            this._update.location = undefined;
          }
        }

        next();
      });
      break;

    default:
      return schema;
  }
};

const parseField = (field, schema, parent) => {
  if (field.schema && field.schema.type === 'object') return parseSchema(field.schema, schema, field.key);
  if (field.schema && field.schema.type === 'array') field.schema.$_terms.items.map(item => parseField({ key: field.key, ...item }, schema, parent));

  if (field.schema) {
    field.schema.$_terms.metas
      .map(meta => parseMeta(schema, field, meta, parent));
  } else {
    field.$_terms.metas
      .map(meta => parseMeta(schema, field, meta, parent));
  }
};


const dotNotate = (obj) => {
  const res = {};
  const notateKey = (o, key) => Object.keys(o)
    .forEach((item) => {
      const value = o[item];
      const currentKey = key ? `${key}.${item}` : item;

      if (String(value) === '[object Object]') {
        return notateKey(value, currentKey);
      }
      res[currentKey] = value;
    });

  notateKey(obj);
  return res;
};

const removeRequiredField = (field) => {
  if (field._flags && field._flags.presence === 'required') {
    const { presence, ..._flags } = field._flags;

    if (Object.keys(_flags).length) {
      field._flags = _flags;
    }
  }
  return field;
};

const removeRequired = (model) => {
  if (model.$_terms && model.$_terms.keys) {
    model.$_terms.keys = model.$_terms.keys.map((field) => {
      if (field.schema.type === 'object') {
        field.schema.$_terms.keys = field.schema.$_terms.keys.map((f) => {
          return { key: f.key, schema: removeRequired(f.schema) };
        });
      } else if (field.schema.type === 'array') {
        field = { ...field, schema: removeRequiredField(field.schema) };
        field.schema.$_terms.items = field.schema.$_terms.items.map((item) => {
          return removeRequired(item);
        });
      } else {
        return { ...field, schema: removeRequiredField(field.schema) };
      }
      return field;
    });
  } else if (model._flags && model._flags.presence) {
    return removeRequiredField(model);
  }

  return model;
};

module.exports = {
  parseSchema,
  dotNotate,
  removeRequired,
};
