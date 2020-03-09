module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  find(request) {
    const {
      limit = 10,
      skip = 0,
      sort = 'name',
      order = 'ascend',
      fields,
      ...filters
    } = request.query;

    return this.service.find(filters, {
      limit,
      skip,
      sort,
      order,
      fields,
    });
  }

  async findById(request, h) {
    const { _id } = request.params;

    const res = await this.service.findById(_id);
    if (!res) return h.notFound();

    return res;
  }

  async create(request) {
    const { payload, auth } = request;
    const { _id: user } = auth.credentials;
    return this.service.create({ ...payload, meta: { ...payload.meta, user } });
  }

  async update(request, h) {
    const { _id } = request.params;
    const { payload } = request;
    const res = await this.service.update(_id, payload);

    if (!res) return h.notFound();
    return res;
  }

  async remove(request, h) {
    const { _id } = request.params;
    const res = await this.service.remove(_id);

    if (!res) return h.notFound();
    return res;
  }

  async accept(request, h) {
    const { _id } = request.params;

    const change = await this.service.findById(_id);
    if (!change) return h.notFound();

    const { meta, data } = change;
    const {
      create, type, target, user,
    } = meta;

    let res;
    if (create) {
      res = await request.server.plugins.crud[`${type}-service`].create(data);
      await request.server.plugins.users.service.update(user, { $push: { [type]: res._id } });
    } else {
      await request.server.plugins.crud[`${type}-service`].update(target, data);
    }

    await this.service.remove(_id);

    return change;
  }

  async decline(request, h) {
    const { _id } = request.params;

    const change = await this.service.findById(_id);
    if (!change) return h.notFound();

    await this.service.remove(_id);

    return change;
  }
};
