module.exports = (controller, validation) => [
  {
    method: 'GET',
    path: '/{_id}',
    handler: controller.findById,
    config: {
      validate: validation.findById,
      auth: false,
      tags: ['api'],
    },
  },
  {
    method: 'POST',
    path: '/',
    handler: controller.create,
    config: {
      payload: {
        output: 'stream',
        allow: 'multipart/form-data',
        maxBytes: 10 * (1024 * 1024), // 10 MB
      },
      validate: validation.create,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'USER' },
      },
    },
  },
  {
    method: 'PUT',
    path: '/{_id}',
    handler: controller.update,
    config: {
      validate: validation.update,
      auth: 'jwt',
      tags: ['api', 'v2'],
      plugins: {
        hapiAuthorization: { role: 'USER' },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/{_id}',
    handler: controller.remove,
    config: {
      validate: validation.remove,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'USER' },
      },
    },
  },
];
