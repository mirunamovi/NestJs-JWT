import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const swaggerOptions = new DocumentBuilder()
    .setBasePath('/')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`/swagger`, app, document);

  // app.useStaticAssets(join(__dirname, '..', '..', '/public/'), {index: false});

  // app.enableCors({
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  //   credentials: true,
  //   origin: '*',
  // });

  await app.listen(4000, '192.168.0.109');


  // await app.listen(4000, '192.168.0.109');
  // await app.listen(4000, '192.168.46.213');
  // await app.listen(4000, 'localhost');

}

bootstrap();