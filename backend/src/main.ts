// /backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.use(helmet());
  app.use(compression());
 
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  });
 
  app.setGlobalPrefix('api/v1');
 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,         // eliminar campos no declarados en el DTO
    forbidNonWhitelisted: true, // lanzar error si llegan campos no declarados
    transform: true,         // transformar tipos automáticamente (string → number)
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);