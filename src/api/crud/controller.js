module.exports = class Controller {
  constructor(service, schema) {
    this.service = service;
    this.schema = schema;
  }

  find(request, h) {
    const {
      limit = 10,
      skip = 0,
      sort = 'name',
      order = 'ascend',
      fields,
      ids,
      or,
      q,
      pastdates,
      ...filters
    } = request.query;

    return this.service.find(filters, {
      limit,
      skip,
      sort,
      order,
      fields,
      ids,
      or,
      q,
      pastdates,
    });
  }

  async findById(request, h) {
    const { _id } = request.params;
    const { fields, pastdates } = request.query;

    const res = await this.service.findById(_id, fields, pastdates);
    if (!res) return h.notFound();

    return res;
  }

  async create(request, h) {
    const {
      payload, auth, route, server,
    } = request;
    const { credentials } = auth;
    const { _id: userId, role } = credentials;

    if (role === 'ADMIN') {
      return this.service.create(payload);
    }

    const path = route.path.split('/');
    const type = path[path.length - 1];

    const requiredRole = this.schema.metas ? this.schema.metas[0].role : 'ADMIN';
    if (requiredRole === role) {
      const res = await this.service.create(payload);
      await server.plugins.users.service.update(userId, { $push: { [type]: res._id } });
      return res;
    }

    const change = await server.plugins.changes.service.create({
      meta: {
        create: true,
        type,
        user: credentials._id,
      },
      data: payload,
    });

    return {
      isChange: true,
      ...change.toJSON(),
    };
  }

  async update(request, h) {
    const {
      params, payload, auth, route, server,
    } = request;
    const { _id } = params;
    const { credentials } = auth;
    const { role } = credentials;


    const requiredRole = this.schema.metas ? this.schema.metas[0].role : 'ADMIN';
    if (requiredRole === role || role === 'ADMIN') {
      const res = await this.service.update(_id, payload);
      if (!res) return h.notFound();
      return res;
    }

    const path = route.path.replace('/{_id}', '').split('/');
    const type = path[path.length - 1];

    const change = await server.plugins.changes.service.create({
      meta: {
        type,
        target: _id,
        user: credentials._id,
      },
      data: payload,
    });

    return {
      isChange: true,
      ...change.toJSON(),
    };
  }

  async remove(request, h) {
    const { _id } = request.params;
    const res = await this.service.remove(_id);

    if (!res) return h.notFound();
    return res;
  }
};
