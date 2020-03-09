const sendNotification = async (request, h) => {
  const { response, params } = request;
  const { meta } = response.source;
  const { _id } = params;

  const { type, user } = meta;
  const { email } = user;
  request.sendNotificationChangeAccept(email, type, _id);

  return h.continue;
};

sendNotification.applyPoint = 'onPostHandler';

module.exports = sendNotification;
