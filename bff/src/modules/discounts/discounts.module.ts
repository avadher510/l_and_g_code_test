import { Module } from '@nestjs/common';
import { DiscountsController } from './presentation/DiscountsController';
import { DiscountEngine } from './application/DiscountEngine';
import { InMemoryDiscountRepository } from './infrastructure/InMemoryDiscountRepository';
import { DISCOUNT_REPOSITORY_TOKEN } from './domain/IDiscountRepository';

/**
 * Discounts module encapsulating all discount-related functionality.
 * Provides the discount repository as an injectable dependency using the
 * repository interface token pattern; exports DiscountEngine for use
 * by the checkout module to calculate applicable discounts.
 */
@Module({
  controllers: [DiscountsController],
  providers: [
    DiscountEngine,
    {
      provide: DISCOUNT_REPOSITORY_TOKEN,
      useClass: InMemoryDiscountRepository,
    },
  ],
  exports: [DiscountEngine, DISCOUNT_REPOSITORY_TOKEN],
})
export class DiscountsModule {}
