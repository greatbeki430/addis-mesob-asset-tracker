const app = require('./src/app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');

const start = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`[server] ${env.nodeEnv} mode - listening on http://localhost:${env.port}`);
  });

  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (err) => {
    console.error('[server] Unhandled rejection:', err);
    server.close(() => process.exit(1));
  });
};

start();
