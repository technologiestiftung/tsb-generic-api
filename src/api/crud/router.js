module.exports = (name, controller, validation, schema) => [
  {
    method: 'GET',
    path: `${name}`,
    handler: controller.find,
    config: {
      validate: validation.find,
      auth: false,
      tags: ['api', 'v2'],
      plugins: {
        policies: ['filterOwnEntries'],
      },
    },
  }, {
    method: 'GET',
    path: `${name}/{_id}`,
    handler: controller.findById,
    config: {
      validate: validation.findById,
      auth: false,
      tags: ['api', 'v2'],
      plugins: {
        policies: ['accessOwnEntry'],
      },
    },
  }, {
    method: 'POST',
    path: `${name}`,
    handler: controller.create,
    config: {
      validate: {
        failAction: (req, h, err) => h.badRequest(err),
        ...validation.create,
      },
      auth: 'jwt',
      tags: ['api', 'v2'],
      plugins: {
        policies: ['notifyChange'],
      },
    },
  }, {
    method: 'PUT',
    path: `${name}/{_id}`,
    handler: controller.update,
    config: {
      validate: {
        failAction: (req, h, err) => h.badRequest(err),
        ...validation.update,
      },
      auth: 'jwt',
      tags: ['api', 'v2'],
      plugins: {
        policies: ['isOwner', 'notifyChange'],
      },
    },
  }, {
    method: 'DELETE',
    path: `${name}/{_id}`,
    handler: controller.remove,
    config: {
      validate: validation.remove,
      auth: 'jwt',
      tags: ['api', 'v2'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  },
  {
    method: 'GET',
    path: `${name}/schema`,
    handler: () => schema,
    config: {
      tags: ['api', 'v2'],
      auth: false,
    },
  },
];
