import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CartService } from '../../cart/application/CartService';
import { ProductsService } from '../../products/application/ProductsService';
import { DiscountEngine } from '../../discounts/application/DiscountEngine';
import type { IDiscountRepository } from '../../discounts/domain/IDiscountRepository';
import { DISCOUNT_REPOSITORY_TOKEN } from '../../discounts/domain/IDiscountRepository';
import {
  CheckoutResult,
  OrderSummary,
  OrderLineItem,
} from './dto/CheckoutResponseDto';
import { Cart } from '../../cart/domain/Cart.entity';
import { AppliedDiscount } from '../../discounts/domain/Discount.entity';

/**
 * Service responsible for processing cart checkout operations.
 * Coordinates stock validation, discount calculation, and order finalisation;
 * handles both successful checkout flows and failure scenarios with detailed
 * error reporting. All checkout operations are atomic; either the entire
 * checkout succeeds or all reserved stock is released.
 */
@Injectable()
export class CheckoutService {
  constructor(
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
    private readonly discountEngine: DiscountEngine,
    @Inject(DISCOUNT_REPOSITORY_TOKEN)
    private readonly discountRepository: IDiscountRepository,
  ) {}

  /**
   * Processes checkout for a shopping cart by its unique identifier.
   * Validates stock availability for all items; calculates applicable discounts;
   * deducts stock and marks cart as checked out on success. On failure due to
   * insufficient stock, releases all reservations and marks cart as expired.
   *
   * @param cartId - The unique identifier of the cart to check out
   * @returns CheckoutResult with order summary on success or failure details
   */
  processCartCheckoutById(cartId: string): CheckoutResult {
    const cartResponse = this.cartService.retrieveActiveCartByIdOrThrow(cartId);
    const cart: Cart = {
      id: cartResponse.id,
      items: cartResponse.items,
      createdAt: cartResponse.createdAt,
      lastActivityAt: cartResponse.lastActivityAt,
      status: cartResponse.status,
    };

    const stockFailures = this.productsService.validateSufficientStockForAllCartItems(
      cart.items,
    );

    if (stockFailures.length > 0) {
      this.productsService.releaseStockReservationForAllCartItems(cart.items);
      this.cartService.expireCartAndReleaseAllStockReservations(cartId);

      return {
        success: false,
        failureReason:
          'One or more items in your basket do not have sufficient stock; please review the items below.',
        insufficientStockItems: stockFailures,
      };
    }

    const subtotalInPence = this.discountEngine.calculateCartSubtotalInPence(
      cart.items,
    );

    const activeDiscounts = this.discountRepository.findAllActiveDiscounts();

    const appliedDiscounts = this.discountEngine.calculateAllApplicableDiscountsForCart(
      cart,
      activeDiscounts,
    );

    this.productsService.deductStockForAllPurchasedItems(cart.items);

    this.cartService.expireCartAndReleaseAllStockReservations(cartId);

    const orderSummary = this.buildOrderSummaryFromCompletedCart(
      cart,
      appliedDiscounts,
      subtotalInPence,
    );

    return {
      success: true,
      orderId: orderSummary.orderId,
      orderSummary,
    };
  }

  /**
   * Builds a complete order summary from a successfully checked-out cart.
   * Calculates line totals, applies all discounts, and generates a unique order ID.
   *
   * @param cart - The cart that was successfully checked out
   * @param appliedDiscounts - Array of discounts applied to the order
   * @param subtotalInPence - The cart subtotal before discounts
   * @returns Complete order summary with all line items and discount details
   */
  private buildOrderSummaryFromCompletedCart(
    cart: Cart,
    appliedDiscounts: AppliedDiscount[],
    subtotalInPence: number,
  ): OrderSummary {
    const lineItems: OrderLineItem[] = cart.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitPriceInPence: item.unitPriceInPence,
      quantity: item.quantity,
      lineTotalInPence: item.unitPriceInPence * item.quantity,
    }));

    const totalDiscountAmountInPence = appliedDiscounts.reduce(
      (sum, discount) => sum + discount.savingInPence,
      0,
    );

    const finalTotalInPence = Math.max(
      0,
      subtotalInPence - totalDiscountAmountInPence,
    );

    return {
      orderId: this.generateUniqueOrderId(),
      lineItems,
      subtotalInPence,
      appliedDiscounts,
      totalDiscountAmountInPence,
      finalTotalInPence,
      checkedOutAt: new Date(),
    };
  }

  /**
   * Generates a unique order identifier.
   * Format: ORD- followed by the first 8 characters of a UUID in uppercase.
   *
   * @returns A unique order ID string
   */
  private generateUniqueOrderId(): string {
    return `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
  }
}
