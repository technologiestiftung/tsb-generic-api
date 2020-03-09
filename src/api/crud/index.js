const fs = require('fs');
const path = require('path');
const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose, null, {
  timestamps: true,
  toJSON: { virtuals: true },
});

const router = require('./router');
const caching = require('./cache');
const Service = require('./service');
const Controller = require('./controller');
const Validation = require('./validation');

const { parseSchema } = require('../../utils/schema');

const register = async (server, { models, cache }) => {
  if (!models) return;

  // register model
  const schemas = [];
  const exportedModels = [];
  const folder = path.resolve(models);
  const files = fs.readdirSync(folder);
  files.forEach(async (file) => {
    const [name] = file.split('.');
    const modelPath = path.resolve(folder, file);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const model = require(modelPath);
    exportedModels.push(model);
    const convertedModel = Joigoose.convert(model);
    const schema = new server.mongoose.Schema(convertedModel, {
      toJSON: { virtuals: true },
      collation: { locale: 'de', strength: 1 },
    });

    const parsedSchema = parseSchema(model, schema);

    const registeredModel = server.mongoose.model(name, parsedSchema);

    // init service
    const service = new Service(registeredModel);
    const cachedService = await caching(name, server, service, cache);

    // Store described schema
    const describedSchema = model.describe();
    schemas.push(describedSchema);

    // init controller
    const controller = new Controller(cachedService, describedSchema);
    server.bind(controller);

    // Merge validation schemas (default + custom provided fields)
    const validation = Validation(model);

    // init router
    const routes = router(name, controller, validation, describedSchema);
    routes.forEach(route => server.route(route));

    server.expose(`${name}-service`, service);
  });

  server.expose('models', exportedModels);

  // expose schemas for all routes
  server.route({
    method: 'GET',
    path: 'schemas',
    handler: () => schemas,
    config: {
      tags: ['api', 'v2'],
      auth: false,
    },
  });
};

exports.plugin = {
  name: 'crud',
  version: '0.0.1',
  register,
  dependencies: ['db', 'email', 'users'],
};
