import { Module } from '@nestjs/common';
import { CartExpiryScheduler } from '../scheduler/CartExpiryScheduler';
import { CartModule } from '../modules/cart/cart.module';

/**
 * Shared module providing cross-cutting concerns and scheduled tasks.
 * Exports the CartExpiryScheduler for use in the application bootstrap process.
 */
@Module({
  imports: [CartModule],
  providers: [CartExpiryScheduler],
  exports: [CartExpiryScheduler],
})
export class SharedModule {}
