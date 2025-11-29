import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS для фронтенда
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Включаем валидацию
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  const port = process.env.PORT || 8000;
  await app.listen(port);
  
  console.log(`🚀 Finance Backend API запущен на порту ${port}`);
  console.log(`📊 API доступен по адресу: http://localhost:${port}`);
  console.log(`📋 Документация: http://localhost:${port}/api`);
}

bootstrap();
