import { Injectable } from '@nestjs/common';
import { Discount, DiscountType, AppliedDiscount } from '../domain/Discount.entity';

export interface Cart {
  id: string;
  items: CartItem[];
  createdAt: Date;
  lastActivityAt: Date;
  status: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  unitPriceInPence: number;
  quantity: number;
}

/**
 * Pure calculation engine for evaluating and applying discounts to shopping carts.
 * Contains no side effects or external dependencies; all methods are deterministic
 * and testable in isolation. Implements three discount strategies: percentage off order,
 * buy X get Y free, and fixed amount off order. All discounts stack; every qualifying
 * discount is applied to the cart.
 */
@Injectable()
export class DiscountEngine {
  /**
   * Evaluates all active discounts against a shopping cart.
   * Returns every discount that qualifies based on the cart contents and subtotal;
   * discounts stack, so multiple discounts can apply to a single cart.
   *
   * @param cart - The shopping cart to evaluate discounts against
   * @param discounts - Array of all active discounts to consider
   * @returns Array of applied discounts with calculated savings in pence
   */
  calculateAllApplicableDiscountsForCart(
    cart: Cart,
    discounts: Discount[],
  ): AppliedDiscount[] {
    const appliedDiscounts: AppliedDiscount[] = [];
    const subtotalInPence = this.calculateCartSubtotalInPence(cart.items);

    for (const discount of discounts) {
      let savingInPence = 0;

      switch (discount.type) {
        case DiscountType.PERCENTAGE_OFF_ORDER:
          savingInPence = this.applyPercentageOffOrderDiscount(
            subtotalInPence,
            discount,
          );
          break;
        case DiscountType.BUY_X_GET_Y_FREE:
          savingInPence = this.applyBuyXGetYFreeDiscount(cart.items, discount);
          break;
        case DiscountType.FIXED_AMOUNT_OFF_ORDER:
          savingInPence = this.applyFixedAmountOffOrderDiscount(
            subtotalInPence,
            discount,
          );
          break;
      }

      if (savingInPence > 0) {
        appliedDiscounts.push({
          discountId: discount.id,
          discountName: discount.name,
          discountType: discount.type,
          savingInPence,
        });
      }
    }

    return appliedDiscounts;
  }

  /**
   * Calculates the subtotal for a cart by summing the line totals of all items.
   * Line total for each item is calculated as unit price multiplied by quantity.
   *
   * @param items - Array of cart items to calculate subtotal for
   * @returns Subtotal in pence as an integer
   */
  calculateCartSubtotalInPence(items: CartItem[]): number {
    return items.reduce(
      (total, item) => total + item.unitPriceInPence * item.quantity,
      0,
    );
  }

  /**
   * Applies a percentage-based discount to the order subtotal.
   * Returns zero if the subtotal is below the minimum order value threshold;
   * otherwise calculates the saving as a percentage of the subtotal, rounded
   * to the nearest pence.
   *
   * @param subtotalInPence - The cart subtotal in pence
   * @param discount - The discount configuration with percentage value and minimum threshold
   * @returns Saving in pence; zero if subtotal is below minimum
   */
  private applyPercentageOffOrderDiscount(
    subtotalInPence: number,
    discount: Discount,
  ): number {
    const minimumOrderValue = discount.conditions.minimumOrderValueInPence ?? 0;

    if (subtotalInPence < minimumOrderValue) {
      return 0;
    }

    return Math.round(subtotalInPence * (discount.value / 100));
  }

  /**
   * Applies a buy X get Y free discount to a specific product in the cart.
   * Returns zero if the applicable product is not in the cart or if the quantity
   * is below the buy threshold. Calculates the number of free items based on
   * how many complete sets of (buy + get) quantities fit into the cart quantity.
   *
   * @param cartItems - Array of items in the cart
   * @param discount - The discount configuration with product ID, buy quantity, and get quantity
   * @returns Saving in pence based on free items; zero if discount does not apply
   */
  private applyBuyXGetYFreeDiscount(
    cartItems: CartItem[],
    discount: Discount,
  ): number {
    const applicableProductId = discount.conditions.applicableProductId;
    const buyQuantity = discount.conditions.buyQuantity ?? 0;
    const getQuantity = discount.conditions.getQuantity ?? 0;

    const applicableItem = cartItems.find(
      (item) => item.productId === applicableProductId,
    );

    if (!applicableItem) {
      return 0;
    }

    if (applicableItem.quantity < buyQuantity) {
      return 0;
    }

    const freeItemCount =
      Math.floor(applicableItem.quantity / (buyQuantity + getQuantity)) *
      getQuantity;

    return freeItemCount * applicableItem.unitPriceInPence;
  }

  /**
   * Applies a fixed amount discount to the order.
   * Returns the discount value in pence if the subtotal meets or exceeds
   * the minimum order value threshold; otherwise returns zero.
   *
   * @param subtotalInPence - The cart subtotal in pence
   * @param discount - The discount configuration with fixed value and minimum threshold
   * @returns The discount value in pence; zero if subtotal is below minimum
   */
  private applyFixedAmountOffOrderDiscount(
    subtotalInPence: number,
    discount: Discount,
  ): number {
    const minimumOrderValue = discount.conditions.minimumOrderValueInPence ?? 0;

    if (subtotalInPence < minimumOrderValue) {
      return 0;
    }

    return discount.value;
  }
}
