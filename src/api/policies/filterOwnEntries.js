const filterOwnEntries = async (request, h) => {
  const { route, server, models } = request;

  try {
    const { credentials } = await server.auth.test('jwt', request);
    if (credentials && credentials.role === 'USER') {
      const path = route.path.split('/');
      const type = path[path.length - 1];

      const user = await models.User.findById(credentials._id);
      if (!request.query.ids || (request.query.ids && !request.query.ids.length)) {
        request.query.ids = user[type];
      }
    }
  } catch (err) {
    return h.continue;
  }

  return h.continue;
};


module.exports = filterOwnEntries;
