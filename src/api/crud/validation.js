const _ = require('lodash');
const Joi = require('../../utils/joiExtensions');
const { removeRequired } = require('../../utils/schema');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();

const controls = Joi.object({
  limit: Joi.number(),
  skip: Joi.number(),
  sort: Joi.string().empty(''),
  order: Joi.string().valid('ascend', 'descend'),
  fields: Joi.array(),
  ids: Joi.array().items(Joi.string()),
  or: Joi.array().items(Joi.object()),
  distance: Joi.number(),
  q: Joi.string(),
  pastdates: Joi.bool(),
});

module.exports = model => ({
  find: {
    query: removeRequired(_.cloneDeep(model)).concat(controls),
  },
  findById: {
    params: Joi.object({
      _id,
    }),
    query: Joi.object({
      fields: Joi.array(),
      pastdates: Joi.bool(),
    }),
  },
  create: {
    payload: model,
  },
  update: {
    payload: model,
  },
  remove: {
    params: Joi.object({
      _id,
    }),
  },
});
