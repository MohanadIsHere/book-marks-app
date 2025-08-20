import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/env';
import helmet from 'helmet';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(morgan('combined'));
  
  await app.listen(PORT ?? 8303, () => {
    console.log(`Server started on port ${PORT ?? 8303} 🚀 !`);
  });
}
bootstrap();
