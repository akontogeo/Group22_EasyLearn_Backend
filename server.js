import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDatabase();
    const server = app.listen(PORT, () => {
      console.log(`EasyLearn server listening on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the process using that port or set PORT in environment.`);
        process.exit(1);
      }
      console.error('Server error', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
