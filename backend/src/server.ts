import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { authRouter } from './modules/auth/routes.js';
import { alvesAuthRouter } from './modules/alvesAuth/routes.js';
import { usersRouter } from './modules/users/routes.js';
import { companiesRouter } from './modules/companies/routes.js';
import { catalogRouter } from './modules/catalog/routes.js';
import { evaluationsRouter } from './modules/evaluations/routes.js';
import { auditRouter } from './modules/audit/routes.js';
import { alvesRouter, publicAlvesRouter } from './modules/alves/routes.js';
import { odooRouter } from './modules/integrations/odooRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;
const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5180')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }
});

app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'data:', 'blob:', 'https:']
    }
  }
}));
const apiCors = cors({
  origin: (origin, callback) => {
    if (!origin || configuredOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não autorizada'));
  },
  credentials: false
});
const publicAlvesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Muitas solicitações. Aguarde alguns minutos e tente novamente.' }
});
app.use(express.json({ limit: '10mb' }));
app.use('/api', (req, res, next) => {
  const origin = req.headers.origin;
  const sameOrigin = origin && origin === `${req.protocol}://${req.get('host')}`;
  if (!origin || sameOrigin) return next();
  return apiCors(req, res, next);
});
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use('/api/public', publicAlvesLimiter);
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(['/api/auth/login', '/api/auth/forgot-password', '/api/auth/reset-password-with-token', '/api/alves-auth/login', '/api/alves-auth/forgot-password', '/api/alves-auth/reset-password-with-token'], authLimiter);

// Rotas da API
app.use('/api/auth', authRouter);
app.use('/api/alves-auth', alvesAuthRouter);
app.use('/api/users', usersRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/integrations/odoo', odooRouter);
app.use('/api/alves', alvesRouter);
app.use('/api/public', publicAlvesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'Libus Partner API', version: '1.0.0' });
});

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err?.message === 'Origem não autorizada') {
    return res.status(403).json({ error: 'Origem não autorizada' });
  }
  return next(err);
});

// Em produção, o mesmo serviço Render pode servir API e frontend.
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  return res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Libus Partner Backend rodando em http://localhost:${PORT}`);
});
