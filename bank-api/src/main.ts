import { loadParameters } from './config/aws-parameter-store.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  //if useAWS = true -> use secret files from AWS Parameter store not from local .env
  const useAWS = process.env.USE_AWS_PARAMETER_STORE === 'true';
  if (useAWS) {
    await loadParameters(); //load environment variables from AWS Parameter Store
  }
  const PORT = process.env.PORT ?? 3005;
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); //Without that, req.cookies will be undefined.

  // Enable CORS for Next.js frontend
  //This must be before app.listen(PORT).
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Next.js frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, //Without this → cookies will NEVER be sent
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  try {
    await app.listen(PORT, '0.0.0.0');
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}
bootstrap();
