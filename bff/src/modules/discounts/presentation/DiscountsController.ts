import { Controller, Get, Inject } from '@nestjs/common';
import type { IDiscountRepository } from '../domain/IDiscountRepository';
import { DISCOUNT_REPOSITORY_TOKEN } from '../domain/IDiscountRepository';
import { Discount } from '../domain/Discount.entity';

/**
 * Controller handling all discount-related HTTP endpoints.
 * Provides access to active discount information for display
 * to customers before they complete their checkout.
 */
@Controller('discounts')
export class DiscountsController {
  constructor(
    @Inject(DISCOUNT_REPOSITORY_TOKEN)
    private readonly discountRepository: IDiscountRepository,
  ) {}

  /**
   * Retrieves all currently active discounts.
   * Returns discount details including type, value, and conditions
   * for display in the shopping interface.
   *
   * @returns Array of all active discounts
   */
  @Get()
  findAllActiveDiscounts(): Discount[] {
    return this.discountRepository.findAllActiveDiscounts();
  }
}
