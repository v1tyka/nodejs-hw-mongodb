import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import router from './routers/index.js';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
dotenv.config();
const PORT = process.env.PORT;
function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(router);

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;
