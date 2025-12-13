import auth from 'basic-auth';
import { DEFAULT_ADMIN } from '../config/constants.js';

// Middleware for HTTP Basic Authentication (admin-only routes)
export function basicAuth(req, res, next) {
  const credentials = auth(req);
  if (!credentials || credentials.name !== DEFAULT_ADMIN.username || credentials.pass !== DEFAULT_ADMIN.password) {
    res.setHeader('WWW-Authenticate', 'Basic realm="EasyLearn"');
    return res.status(401).json({ success: false, error: 'Unauthorized', message: 'Invalid credentials' });
  }
  next();
}
