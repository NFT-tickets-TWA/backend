import { NestFactory } from '@nestjs/core';
// swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

import * as dotenv from 'dotenv';
import * as process from "process";
import * as fs from "fs";
import {printSchema} from "graphql/utilities";
import {GraphQLSchemaBuilderModule, GraphQLSchemaFactory} from "@nestjs/graphql";
;
dotenv.config();

async function bootstrap() {
  // const httpsOptions = {
  //   cert: fs.readFileSync('./ssl/cert.pem'),
  //   key: fs.readFileSync('./ssl/key.pem'),
  // };
  const app = await NestFactory.create(AppModule, { cors: true });
  // const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });
  // prisma
  const prismaService = app.get(PrismaService);
  app.enableShutdownHooks();

  // swagger
  const config = new DocumentBuilder()
      .setTitle('NFT-Tickets server')
      .setDescription('Main server')
      .addServer("https://backend-production-299c.up.railway.app")
      .setVersion('0.1')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup("/api", app, document);
  // await app.listen( process.env.SERVICE_PORT, process.env.HOST_NAME);
  await app.listen(process.env.PORT || process.env.SERVICE_PORT, "0.0.0.0");
}
bootstrap();

