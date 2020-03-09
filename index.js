require('dotenv').config();
const Glue = require('@hapi/glue');
const path = require('path');
const Model = require('./src/utils/joiExtensions');

const mani = path.resolve(__dirname, 'manifest.json');
// eslint-disable-next-line import/no-dynamic-require
const config = require(mani);

const parseEnv = (manifest) => {
  if (!manifest || typeof manifest !== 'object') {
    return;
  }

  const res = manifest;
  // eslint-disable-next-line consistent-return
  Object.keys(manifest).forEach((key) => {
    const value = manifest[key];
    if (typeof value === 'string' && value.startsWith('$env.')) {
      res[key] = process.env[value.slice(5)];
    } else {
      return parseEnv(value);
    }
  });

  // eslint-disable-next-line consistent-return
  return res;
};

const start = async () => {
  const options = {
    relativeTo: path.resolve(__dirname),
  };

  try {
    const parsedManifest = parseEnv(config);
    const server = await Glue.compose(parsedManifest, options);
    await server.start();
    return server;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') start();

module.exports = { start, Model };
