const sendNotification = async (request, h) => {
  const { response } = request;
  const { meta, data, _id } = response.source;

  if (meta && data) {
    request.sendNotificationChange(_id);
  }

  return h.continue;
};

sendNotification.applyPoint = 'onPostHandler';

module.exports = sendNotification;
