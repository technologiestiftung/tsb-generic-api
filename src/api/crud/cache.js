const catboxMemory = require('@hapi/catbox-memory');
const catboxRedis = require('@hapi/catbox-redis');

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const defaults = {
  enabled: true,
  expiresIn: 24 * HOUR,
  timeout: 30 * SECOND,
};

module.exports = async (name, server, service, options = defaults) => {
  // caching
  if (options.enabled) {
    // clone class instance
    const uncached = Object.assign(Object.create(Object.getPrototypeOf(service)), service);

    if (options.redis || process.env.REDIS_URL) {
      // init redis cache
      await server.cache.provision({
        name,
        provider: {
          constructor: catboxRedis,
          options: {
            url: process.env.REDIS_URL,
            partition: name,
          },
        },
      });
    } else {
      // init memory cache
      await server.cache.provision({ name, provider: catboxMemory });
    }

    let cacheId = server.mongoose.Types.ObjectId();

    const readMethods = ['find', 'findById'];
    readMethods.forEach((method) => {
      const cache = server.cache({
        cache: name,
        segment: method,
        expiresIn: options.expiresIn,
        generateTimeout: options.timeout,
        generateFunc: ({ args }) => uncached[method](...args),
      });

      service[method] = (...args) => cache.get({ id: JSON.stringify({ args, cacheId }), args });
    });

    // invalidate cache on write
    const writeMethods = ['create', 'update', 'remove'];
    writeMethods.forEach((method) => {
      service[method] = (...args) => {
        cacheId = server.mongoose.Types.ObjectId();
        return uncached[method](...args);
      };
    });
  }
  return service;
};
