import { Controller, Post, Param } from '@nestjs/common';
import { CheckoutService } from '../application/CheckoutService';
import type { CheckoutResult } from '../application/dto/CheckoutResponseDto';

/**
 * Controller handling checkout operations.
 * Provides the endpoint to process cart checkout; returns either a successful
 * order summary or detailed failure information with stock availability issues.
 */
@Controller('cart')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  /**
   * Processes checkout for a shopping cart.
   * Validates stock, applies discounts, and finalises the order on success;
   * releases reservations and provides detailed error information on failure.
   *
   * @param cartId - The unique identifier of the cart to check out
   * @returns CheckoutResult with order summary or failure details
   * @throws AppError if cart is not found, expired, or already checked out
   */
  @Post(':cartId/checkout')
  processCartCheckoutById(
    @Param('cartId') cartId: string,
  ): CheckoutResult {
    return this.checkoutService.processCartCheckoutById(cartId);
  }
}
