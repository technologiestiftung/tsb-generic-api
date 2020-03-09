module.exports = class Service {
  constructor(db) {
    this.db = db;
  }

  count(filter) {
    return this.db.countDocuments(filter);
  }

  async find(filter, options = {}) {
    // convert array ['name', 'address', ...] to object {'name': 1, 'address': 1, ...}
    const fields = options.fields
      ? options.fields
        .map(field => ({ [field]: 1 }))
        .reduce((acc, curr) => Object.assign(acc, curr), {})
      : {};

    const data = await this.db.find(
      filter,
      fields,
      {
        limit: options.limit,
        skip: options.skip,
        sort: { [options.sort]: options.order === 'ascend' ? 1 : -1 },
        autopopulate: options.fields,
      },
    );

    const count = await this.count(filter);

    return { data, count };
  }

  findById(_id) {
    return this.db.findById(_id);
  }

  findByEmail(email) {
    return this.db.findOne({ email });
  }

  async update(_id, attributes) {
    return this.db.findByIdAndUpdate(_id, attributes, { new: true });
  }

  remove(_id) {
    return this.db.findByIdAndDelete(_id);
  }

  async create({
    email,
    password,
    meta,
    role = 'USER',
    verified = false,
    blocked = true,
  }) {
    return this.db.create({
      email,
      password,
      meta,
      role,
      verified,
      blocked,
    });
  }

  addRelation(_id, relation, relId) {
    const res = {
      [relation]: relId,
    };

    return this.db.findByIdAndUpdate(_id, res, { new: true });
  }

  removeRelation(_id, relation, relId) {
    const $unset = {
      [relation]: relId,
    };

    return this.db.findByIdAndUpdate(_id, { $unset }, { new: true });
  }
};
