import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './shared/filters/GlobalHttpExceptionFilter';
import { ResponseTransformInterceptor } from './shared/interceptors/ResponseTransformInterceptor';
import { globalValidationPipe } from './shared/pipes/GlobalValidationPipe';
import { CartExpiryScheduler } from './scheduler/CartExpiryScheduler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(globalValidationPipe);
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  const cartExpiryScheduler = app.get(CartExpiryScheduler);
  cartExpiryScheduler.startCartExpiryCheckInterval();

  process.on('SIGTERM', () => {
    cartExpiryScheduler.stopCartExpiryCheckInterval();
  });

  await app.listen(3001);
  console.log('Retail Shopping BFF running on http://localhost:3001');
}

void bootstrap();
