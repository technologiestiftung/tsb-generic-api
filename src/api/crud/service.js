const { dotNotate } = require('../../utils/schema');

module.exports = class Service {
  constructor(db) {
    this.db = db;
  }

  count(filter) {
    // FIXME see https://github.com/Automattic/mongoose/issues/6911
    return this.db.count(filter);
  }

  async find(filter, options) {
    // convert array ['name', 'address', ...] to object {'name': 1, 'address': 1, ...}
    const fields = options.fields
      ? options.fields
        .map(field => ({ [field]: 1 }))
        .reduce((acc, curr) => Object.assign(acc, curr), {})
      : {};

    let formattedFilters = dotNotate(filter);
    Object.keys(formattedFilters).forEach((key) => {
      try {
        if (this.db.schema.path(key).instance === 'Array') {
          // geospatial queries
          if (key.endsWith('coordinates') && filter.distance) {
            formattedFilters[key.replace('.coordinates', '')] = {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: formattedFilters[key],
                },
                $maxDistance: filter.distance * 1000,
              },
            };
            delete formattedFilters[key];
            delete formattedFilters.distance;
          }

          // tags
          if (key.endsWith('tags')) {
            formattedFilters.tags = { $in: formattedFilters[key] };
          }
        }

        // date queries
        if (this.db.schema.path(key).instance === 'Date') {
          const formattedKey = key.replace('.0.', '.');
          if (key.endsWith('from')) formattedFilters[formattedKey] = { $gte: formattedFilters[key] };
          if (key.endsWith('to')) formattedFilters[formattedKey] = { $lte: formattedFilters[key] };
          delete formattedFilters[key];
        }
      } catch (err) {
        console.log(`Cannot recognize schema information for parameter ${key}`);
      }
    });

    if (options.ids) formattedFilters._id = { $in: options.ids };
    if (options.or) formattedFilters.$or = options.or;

    const queryOptions = {
      limit: options.limit,
      skip: options.skip,
      sort: { [options.sort]: options.order === 'ascend' ? 'asc' : 'desc' },
      autopopulate: true,
    };

    if (options.fields) {
      const populatedFields = options.fields.map((field) => {
        if (Object.keys(this.db.schema.virtuals).includes(field)) {
          return field;
        }
        const type = this.db.schema.path(field);
        if (type && type.instance === 'ObjectID' || type && type.caster && type.caster.instance === 'ObjectID') {
          return field;
        }
      }).filter(f => !!f);
      queryOptions.autopopulate = false;
      queryOptions.populate = populatedFields
        .map(field => ({ path: field, options: { autopopulate: false } }));
    }

    // text search
    if (options.q) {
      // TODO generalize field names
      const searchableFields = [
        'name',
        'general.name',
        'general.title',
        'general.description',
      ];

      if (formattedFilters.$or) {
        formattedFilters.$or = formattedFilters.$or.map(filters => searchableFields.map(field => ({
          ...filters,
          [field]: {
            $regex: options.q,
            $options: 'i',
          },
        }))).reduce((prev, curr) => prev.concat(curr), []);
      } else {
        formattedFilters = {
          $or: searchableFields.map(field => ({
            [field]: {
              $regex: options.q,
              $options: 'i',
            },
          })),
          ...formattedFilters,
        };
      }
    }

    const data = await this.db.find(
      formattedFilters,
      fields,
      queryOptions,
    );

    const count = await this.count(formattedFilters);

    return {
      data: data.map((entry) => {
        const doc = entry.toJSON();
        if (doc.dates && !options.pastdates) {
          return {
            ...doc,
            dates: // filter out past dates
              formattedFilters['dates.date.from']
                ? doc.dates.filter((d) => {
                  if (d.date && d.date.from) {
                    return new Date(d.date.from) >= new Date(formattedFilters['dates.date.from'].$gte);
                  }
                  return d;
                })
                : doc.dates.filter((d) => {
                  if (d.date && d.date.from) {
                    return new Date(d.date.from) >= new Date();
                  }
                  return d;
                }),
          };
        }
        return doc;
      }),
      count,
    };
  }

  async findById(_id, fields, pastdates) {
    let queryOptions = {
      autopopulate: true,
    };

    if (fields) {
      const populatedFields = fields.map((field) => {
        if (Object.keys(this.db.schema.virtuals).includes(field)) {
          return field;
        }
        const type = this.db.schema.path(field);
        if (type && type.instance === 'ObjectID' || type && type.caster && type.caster.instance === 'ObjectID') {
          return field;
        }
      }).filter(f => !!f);
      queryOptions = {
        autopopulate: false,
        populate: populatedFields.map(field => ({ path: field, options: { autopopulate: false } })),
      };
    }

    const data = await this.db.findById(_id, fields, queryOptions);
    if (!data) return;

    const res = data.toJSON();
    if (res.dates && !pastdates) {
      return {
        ...res,
        dates: res.dates.filter(d => new Date(d.date.from) >= new Date()),
      };
    }
    return res;
  }

  update(_id, attributes) {
    return this.db.findByIdAndUpdate(_id, attributes, { new: true });
  }

  remove(_id) {
    return this.db.findByIdAndDelete(_id);
  }

  create(entry) {
    return this.db.create(entry);
  }
};
