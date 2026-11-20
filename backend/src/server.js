import app from './app.js';
import { env } from './config/env.js';
import { initDatabase } from '../database/init.js';
import { seedDatabase } from '../database/seed.js';

async function startServer() {
  try {
    // Initialize DB and ensure tables and seeds exist
    await initDatabase();
    await seedDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 PXS BACKEND SERVER RUNNING`);
      console.log(`📡 URL:       http://localhost:${env.PORT}`);
      console.log(`🔒 Mode:      ${env.NODE_ENV}`);
      console.log(`🛡️  Security:  Helmet, RateLimiter, CORS, HttpOnly`);
      console.log(`==================================================\n`);
    });

    // Graceful Shutdown
    const shutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down PXS server gracefully...`);
      server.close(() => {
        console.log('✅ Server closed cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
