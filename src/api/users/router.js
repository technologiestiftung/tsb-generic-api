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
    method: 'PUT',
    path: '/{_id}',
    handler: controller.update,
    config: {
      validate: validation.update,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        policies: ['isOwnProfile', 'passwordStrength', 'notifyUnblocked'],
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
    method: 'GET',
    path: '/me',
    handler: controller.info,
    config: {
      auth: 'jwt',
      tags: ['api'],
    },
  }, {
    method: 'POST',
    path: '/',
    handler: controller.signup,
    config: {
      validate: validation.create,
      auth: false,
      tags: ['api'],
      plugins: {
        policies: ['passwordStrength'],
      },
    },
  }, {
    method: 'GET',
    path: '/confirm-email',
    handler: controller.confirm,
    config: {
      validate: validation.confirm,
      auth: false,
      tags: ['api'],
      plugins: {
        policies: ['notifyAdmin'],
      },
    },
  }, {
    method: 'POST',
    path: '/login',
    handler: controller.login,
    config: {
      validate: validation.login,
      auth: false,
      tags: ['api'],
      plugins: {
        'hapi-rate-limitor': {
          max: 10,
          duration: 5 * 60 * 1000,
          enabled: true,
        },
      },
    },
  }, {
    method: 'GET',
    path: '/refreshToken',
    handler: controller.refreshToken,
    config: {
      validate: validation.refreshToken,
      auth: false,
      tags: ['api'],
      plugins: {
        'hapi-rate-limitor': {
          max: 10,
          duration: 5 * 60 * 1000,
          enabled: true,
        },
      },
    },
  }, {
    method: 'POST',
    path: '/resend-confirmation-email',
    handler: controller.resendConfirmationEmail,
    config: {
      validate: validation.resendConfirmationEmail,
      auth: false,
      tags: ['api'],
    },
  }, {
    method: 'POST',
    path: '/reset-password',
    handler: controller.passwordReset,
    config: {
      validate: validation.passwordReset,
      auth: false,
      tags: ['api'],
    },
  }, {
    method: 'POST',
    path: '/change-password',
    handler: controller.changePassword,
    config: {
      validate: validation.changePassword,
      auth: false,
      tags: ['api'],
      plugins: {
        'hapi-rate-limitor': {
          max: 10,
          duration: 5 * 60 * 1000,
          enabled: true,
        },
        policies: ['passwordStrength'],
      },
    },
  },
];
