import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' }, message: 'Healthy' }));

// Mount API routes at root-level (no /api prefix)
app.use('/', routes);

// ===== ROUTE DEBUGGER (GLOBAL) =====
console.log('📌 Registered Express Routes:');
app._router.stack.forEach((layer) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
    console.log(`${methods} ${layer.route.path}`);
  } else if (layer.name === 'router') {
    layer.handle.stack.forEach((handler) => {
      if (handler.route) {
        const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
        console.log(`${methods} ${handler.route.path}`);
      }
    });
  }
});
console.log('===================================');
// ===================================


// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not Found', message: 'Route not found' });
});

// central error handler
app.use(errorHandler);

export default app;
