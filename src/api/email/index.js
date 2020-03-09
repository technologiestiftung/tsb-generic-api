const nodemailer = require('nodemailer');
const templates = require('./templates');

const register = (server, options) => {
  const host = options.host || 'smtp.';
  const port = options.port || 465;
  const secure = options.secure || true;
  const user = options.user || 'admin@webkid.io';
  const pass = options.pass || '';
  const frontendURL = options.frontendURL || 'https://tsb-kulturb-cms.netlify.com';

  let paths = {
    login: '/login',
    users: '/users',
    confirm: '/confirm-email',
    resetPassword: '/reset-password',
    changes: '/changes',
  };

  if (options.paths) {
    paths = { ...paths, ...options.paths };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    transporter.verify();

    server.method({ name: 'sendEmail', method: transporter.sendMail });
    server.decorate('request', 'sendVerificationEmail', templates.verify(transporter, user, `${frontendURL}${paths.confirm}`));
    server.decorate('request', 'sendResetPasswordEmail', templates.resetPassword(transporter, user, `${frontendURL}${paths.resetPassword}`));
    server.decorate('request', 'sendNotificationChange', templates.notifyChange(transporter, user, `${frontendURL}${paths.changes}`));
    server.decorate('request', 'sendNotificationChangeAccept', templates.notifyChangeAccept(transporter, user, `${frontendURL}`));
    server.decorate('request', 'sendNotificationChangeDecline', templates.notifyChangeDecline(transporter, user, `${frontendURL}`));
    server.decorate('request', 'sendNotificationSignup', templates.notifySignup(transporter, user, `${frontendURL}${paths.users}`));
    server.decorate('request', 'sendNotificationUnblocked', templates.notifyUnblocked(transporter, user, `${frontendURL}${paths.login}`));
  } catch (err) {
    console.error('Error configuring the SMTP server:', host);
  }
};

exports.plugin = {
  name: 'email',
  version: '0.0.1',
  register,
  multiple: true,
};
