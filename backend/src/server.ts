import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const startServer = () => {
  app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
  });
};

startServer();
