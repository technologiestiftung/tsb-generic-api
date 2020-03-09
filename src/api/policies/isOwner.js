const isOwner = async (request, h) => {
  const {
    route, params, auth, models,
  } = request;
  const { _id } = params;
  const { _id: userId, role } = auth.credentials;

  // user is admin and can do everything
  if (role === 'ADMIN') return h.continue;

  const { User } = models;
  const user = await User.findById(userId);

  const path = route.path.replace('/{_id}', '').split('/');
  const type = path[path.length - 1];

  if (user[type].includes(_id)) return h.continue;

  throw h.forbidden();
};

module.exports = isOwner;
