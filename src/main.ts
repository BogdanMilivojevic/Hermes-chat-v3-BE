import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    index: false,
    prefix: '/uploads',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    methods: ['*'],
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
