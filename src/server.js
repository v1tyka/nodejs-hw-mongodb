import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';

export const setupServer = () => {
  const app = express();

  // 🔧 Middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(pino());
  app.use(express.json());

  // 🚀 Публічні маршрути
  app.use('/auth', authRouter);

  // 🔒 Приватні маршрути (з перевіркою токена)
  app.use('/contacts', authenticate, contactsRouter);

  // ⚠️ Обробка 404
  app.use(notFoundHandler);

  // 🧨 Глобальна обробка помилок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });

  return app;
};
