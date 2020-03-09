const _ = require('lodash');

const notifyUnblocked = async (request, h) => {
  const { response, payload } = request;
  if (response.isBoom) return h.continue;
  if (_.isEqual(payload, { blocked: false })) {
    request.sendNotificationUnblocked(response.source.email);
  }

  return h.continue;
};

notifyUnblocked.applyPoint = 'onPreResponse';

module.exports = notifyUnblocked;
