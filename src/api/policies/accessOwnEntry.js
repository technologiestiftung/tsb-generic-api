const accessOwnEntry = async (request, h) => {
  const { params, route, server } = request;
  const { _id } = params;

  const path = route.path.replace('/{_id}', '').split('/');
  const type = path[path.length - 1];

  let user;
  try {
    const { credentials } = await server.auth.test('jwt', request);
    if (credentials && credentials.role === 'USER') {
      user = await request.models.User.findById(credentials._id);
    }
  } catch (err) {
    return h.continue;
  }

  if (user && !user[type].includes(_id)) return h.forbidden();

  return h.continue;
};

module.exports = accessOwnEntry;
