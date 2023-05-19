'use strict';

// Read the .env file.
require('dotenv').config();
require('./env');

// Require the framework
const Fastify = require('fastify');

const prisma = require('./src/db');

// Require library to exit fastify process, gracefully (if possible)
const closeWithGrace = require('close-with-grace');

// Instantiate Fastify with some config
const app = Fastify({
  logger: {
    level: 'debug',
  },
});

// Register your application as a normal plugin.
const appService = require('./src/app');

app.register(appService);

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace(
  { delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 },
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook('onClose', async (instance, done) => {
  await prisma.default.$disconnect();
  closeListeners.uninstall();
  done();
});

// Start listening.
app.listen({ port: process.env.PORT || 3000 }, (err, address) => {
  console.log(`running on port ${address} ...`);
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
