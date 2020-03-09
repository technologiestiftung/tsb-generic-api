const sendNotification = async (request, h) => {
  const { response, payload } = request;
  const { meta } = response.source;
  const { message } = payload;

  const { email } = meta.user;
  request.sendNotificationChangeDecline(email, message);

  return h.continue;
};

sendNotification.applyPoint = 'onPostHandler';

module.exports = sendNotification;
