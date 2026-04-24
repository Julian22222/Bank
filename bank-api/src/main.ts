import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3005;
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js frontend
  //This must be before app.listen(PORT).
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Next.js frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  try {
    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}
bootstrap();
