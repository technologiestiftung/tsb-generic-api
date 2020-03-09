const Joi = require('../../utils/joiExtensions');

const email = Joi.string().email().required();
const password = Joi.string().required();
const token = Joi.string().required();
const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const role = Joi.string().valid('USER', 'ADMIN');

const controls = Joi.object({
  limit: Joi.number(),
  skip: Joi.number(),
  sort: Joi.string().empty(''),
  order: Joi.string().valid('ascend', 'descend'),
  fields: Joi.array(),
});

module.exports = () => ({
  create: {
    payload: Joi.object({
      email,
      password,
      meta: Joi.object({
        name: Joi.string().required(),
        institutionName: Joi.string().required(),
        contactEmail: Joi.string().required(),
        phone: Joi.string().required(),
      }),
    }),
  },
  login: {
    payload: Joi.object({
      email,
      password,
    }),
  },
  refreshToken: {
    query: Joi.object({
      token,
    }),
  },
  search: {
    query: Joi.object({
      name: Joi.string(),
      role,
    }).concat(controls),
  },
  find: {
    query: Joi.object({
      email: Joi.string().email(),
      role,
      meta: Joi.object({
        name: Joi.string(),
        institutionName: Joi.string(),
        contactEmail: Joi.string(),
        phone: Joi.string(),
      }),
    }).concat(controls),
  },
  findById: {
    params: Joi.object({
      _id: ObjectId.required(),
    }),
  },
  confirm: {
    query: Joi.object({
      email,
      token,
    }),
  },
  changePassword: {
    payload: Joi.object({
      email,
      token,
      password,
    }),
  },
  resendConfirmationEmail: {
    payload: Joi.object({ email }),
  },
  update: {
    payload: Joi.object({
      blocked: Joi.bool().label('Gesperrt').meta({ component: 'switch' }),
    }),
  },
  remove: {
    params: Joi.object({
      _id: ObjectId.required(),
    }),
  },
  passwordReset: {
    payload: Joi.object({ email }),
  },
});
