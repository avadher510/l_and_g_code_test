import { ValidationPipe } from '@nestjs/common';

/**
 * Configured global validation pipe for the entire application.
 * Automatically validates all incoming request DTOs using class-validator decorators;
 * strips properties not defined in the DTO (whitelist), rejects requests with
 * non-whitelisted properties, and transforms plain objects to DTO class instances.
 */
export const globalValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
});
