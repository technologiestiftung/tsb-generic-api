const router = require('./router');
const Service = require('./service');
const Controller = require('./controller');
const model = require('./model');
const validation = require('./validation');

const register = (server, options) => {
  const bucket = options.bucket || 'kulturb-api';
  const region = options.region || 'eu-central-1';

  // init model
  const File = model(server.mongoose);

  // init service
  const service = new Service(File, { bucket, region });

  // init controller
  const controller = new Controller(service);
  server.bind(controller);

  // init router
  const routes = router(controller, validation);
  routes.forEach(route => server.route(route));

  server.expose('service', service);
};

exports.plugin = {
  name: 'files',
  version: '0.0.1',
  register,
};
