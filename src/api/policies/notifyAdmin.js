const notifyAdmin = async (request, h) => {
  const { response } = request;
  if (response.isBoom) return h.continue;
  const { _id } = response.source;

  request.sendNotificationSignup(_id);
  return h.continue;
};

notifyAdmin.applyPoint = 'onPreResponse';

module.exports = notifyAdmin;
