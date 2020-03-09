const Joi = require('../../utils/joiExtensions');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();

const controls = Joi.object({
  limit: Joi.number(),
  skip: Joi.number(),
  sort: Joi.string().empty(''),
  order: Joi.string().valid('ascend', 'descend'),
  fields: Joi.array(),
});

module.exports = models => ({
  find: {
    query: Joi.object({
      create: Joi.boolean(),
    }).concat(controls),
  },
  findById: {
    params: Joi.object({
      _id,
    }),
  },
  create: {
    payload: Joi.object({
      meta: {
        create: Joi.boolean().default(false),
        type: Joi.string().required(),
        target: ObjectId,
        user: ObjectId,
      },
      data: Joi.alternatives(models),
    }),
  },
  update: {
    payload: Joi.object({
      meta: {
        create: Joi.boolean(),
        type: Joi.string(),
        target: ObjectId,
        user: ObjectId,
      },
      data: Joi.alternatives(models),
    }),
  },
  remove: {
    params: Joi.object({
      _id,
    }),
  },
  accept: {
    params: Joi.object({
      _id,
    }),
  },
  decline: {
    params: Joi.object({
      _id,
    }),
    payload: Joi.object({
      message: Joi.string(),
    }),
  },
});
