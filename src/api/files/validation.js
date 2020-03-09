const Joi = require('../../utils/joiExtensions');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();

const create = {
  payload: Joi.object({
    imageType: Joi.string().valid('logo', 'image').required(),
    file: Joi.any().required(),
    source: Joi.string().max(300),
    description: Joi.string().max(600),
  }),
};

const findById = {
  params: Joi.object({
    _id,
  }),
};

const update = {
  payload: Joi.object({
    imageType: Joi.string().valid('logo', 'image'),
    source: Joi.string().max(300),
    description: Joi.string().max(600),
  }),
};

const remove = {
  params: Joi.object({
    _id,
  }),
};

module.exports = {
  create,
  findById,
  update,
  remove,
};
