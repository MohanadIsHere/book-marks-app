import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT ?? 8303, () => {
    console.log(`Server started on port ${PORT ?? 8303} 🚀 !`);
  });
}
bootstrap();
