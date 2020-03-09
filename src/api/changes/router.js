module.exports = (controller, validation) => [
  {
    method: 'GET',
    path: '/',
    handler: controller.find,
    config: {
      validate: validation.find,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'GET',
    path: '/{_id}',
    handler: controller.findById,
    config: {
      validate: validation.findById,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'POST',
    path: '/',
    handler: controller.create,
    config: {
      validate: validation.create,
      auth: 'jwt',
      tags: ['api'],
    },
  }, {
    method: 'PUT',
    path: '/{_id}',
    handler: controller.update,
    config: {
      validate: validation.update,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'DELETE',
    path: '/{_id}',
    handler: controller.remove,
    config: {
      validate: validation.remove,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'POST',
    path: '/{_id}/accept',
    handler: controller.accept,
    config: {
      validate: validation.accept,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        policies: ['notifyChangeAccept'],
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'POST',
    path: '/{_id}/decline',
    handler: controller.decline,
    config: {
      validate: validation.decline,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        policies: ['notifyChangeDecline'],
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  },
];
