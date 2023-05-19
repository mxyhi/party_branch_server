const path = require('path');

process.env.PUBLIC_PATH = path.resolve(
  __dirname,
  process.env.PUBLIC_PATH || './public'
);

process.env.STATIC_PATH = path.resolve(
  __dirname,
  process.env.PUBLIC_PATH,
  process.env.STATIC_PATH || './static'
);

process.env.PUBLIC_PREFIX_PATH ||= '/public/';
module.exports = {
  staticPath: process.env.STATIC_PATH,
  publicPath: process.env.PUBLIC_PATH,
  publicPrefixPath: process.env.PUBLIC_PREFIX_PATH,
};
