import { NestFactory } from '@nestjs/core';
// swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // prisma
  const prismaService = app.get(PrismaService);
  app.enableShutdownHooks();
  // swagger
  const config = new DocumentBuilder()
      .setTitle('NFT-Tickets server')
      .setDescription('Description')
      .setVersion('0.1')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.SERVICE_PORT, process.env.HOST_NAME);
}
bootstrap();
