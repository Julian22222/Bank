import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { error } from 'console';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3005;
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js frontend
  //This must be before app.listen(PORT).
  app.enableCors({
    origin: 'http://localhost:3000', // Next.js frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  // await app.listen(process.env.PORT ?? 3005);
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}
bootstrap();
