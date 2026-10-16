import { app } from './app.js';
import { initDb } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDb();
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`⚡ OMKAR NAGU ELECTRICAL WORKS API Server running on port ${PORT}`);
      console.log(`   ➜ Local:   http://localhost:${PORT}`);
      console.log(`   ➜ Network: Available to other devices on the same network`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
