import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { config } from '@/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        level: config.LOG_LEVEL,
      },
    }),
  );
  await app.listen(config.PORT, '0.0.0.0');
}
bootstrap();
