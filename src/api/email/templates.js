const resetPassword = (transporter, user, url) => async (address, token) => {
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: address,
      subject: 'Reset your password',
      text: `Please visit: ${url}?token=${token}`,
    };

    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
    console.error('Error sending reset password email to:', address);
  }
};

const verify = (transporter, user, url) => async (address, token) => {
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: address,
      subject: 'Please verify your account',
      text: `Please visit: ${url}?email=${address}&token=${token}`,
    };

    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending verification email to:', address);
  }
};

const notifyChange = (transporter, user, url) => async (_id) => {
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: user,
      subject: 'New change(s) proposed',
      text: `New change(s) proposed, see them at ${url}/${_id}`,
      html: `New change(s) proposed, see them <a href="${url}/${_id}">here</a>`,
    };
    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending notification email to:', user);
  }
};

const notifyChangeAccept = (transporter, user, url) => async (address, type, _id) => {
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: address,
      subject: 'Your changes have been accepted',
      text: `Your changes have been accepted, see them at ${url}/${type}/${_id}`,
      html: `Your changes have been accepted, see them at <a href="${url}/${type}/${_id}">here</a>`,
    };
    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending notification email to:', address);
  }
};

const notifyChangeDecline = (transporter, user) => async (address, message) => {
  const text = 'Your changes have been declined';
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: address,
      subject: 'Your changes have been declined',
      text: text.concat(`: ${message}` || ''),
      html: text.concat(`: ${message}` || ''),
    };
    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending notification email to:', address);
  }
};

const notifySignup = (transporter, user, url) => async (_id) => {
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: user,
      subject: 'New signup',
      text: `New signup, confirm the account at ${url}/${_id}`,
      html: `New signup, confirm the account <a href="${url}/${_id}">here</a>`,
    };
    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending notification email to:', user);
  }
};

const notifyUnblocked = (transporter, user, url) => async (email) => {
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: email,
      subject: 'Account activated',
      text: `Your account has been activated. You can now login here: ${url}`,
      html: `Your account has been activated. You can now login <a href="${url}">here</a>`,
    };
    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending notification email to:', user);
  }
};

module.exports = {
  resetPassword,
  verify,
  notifyChange,
  notifyChangeAccept,
  notifyChangeDecline,
  notifySignup,
  notifyUnblocked,
};
