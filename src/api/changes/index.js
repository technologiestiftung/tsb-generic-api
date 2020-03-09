const router = require('./router');
const Service = require('./service');
const Controller = require('./controller');
const model = require('./model');
const Validation = require('./validation');

const register = (server, options) => {
  // init model
  const Change = model(server.mongoose);

  // init service
  const service = new Service(Change);

  // init controller
  const controller = new Controller(service);
  server.bind(controller);

  // init validation
  const { models } = server.plugins.crud;
  const validation = Validation(models);

  // init router
  const routes = router(controller, validation);
  routes.forEach(route => server.route(route));

  server.expose('service', service);
  server.expose('controller', controller);
};

exports.plugin = {
  name: 'changes',
  version: '0.0.1',
  register,
};
