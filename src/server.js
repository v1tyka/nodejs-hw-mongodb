import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // ✅ для роботи з cookies
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js'; // ✅ додаємо middleware

export const setupServer = () => {
  const app = express();

  // ✅ Базові middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(pino());
  app.use(express.json());

  // ✅ Захищаємо всі роуты контактів
  app.use('/contacts', authenticate, contactsRouter);

  // ✅ Публічні маршрути
  app.use('/auth', authRouter);

  // ✅ Обробка помилок
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });

  return app;
};
