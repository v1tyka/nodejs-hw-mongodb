import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { fetchAllContacts } from './controllers/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // --- Роут для отримання всіх контактів ---
  app.get('/contacts', fetchAllContacts);

  // Обробка неіснуючих маршрутів
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
