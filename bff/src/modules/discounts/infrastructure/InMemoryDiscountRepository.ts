import { Injectable } from '@nestjs/common';
import { Discount } from '../domain/Discount.entity';
import type { IDiscountRepository } from '../domain/IDiscountRepository';
import { seedDiscounts } from '../data/seedDiscounts';

/**
 * In-memory implementation of the discount repository.
 * Stores all discounts in a Map; initialised with seed data on construction.
 * Provides access to active discounts for the discount engine to evaluate
 * against shopping carts during the checkout process.
 */
@Injectable()
export class InMemoryDiscountRepository implements IDiscountRepository {
  private readonly discountStore: Map<string, Discount>;

  constructor() {
    this.discountStore = new Map<string, Discount>();
    seedDiscounts.forEach((discount) => {
      this.discountStore.set(discount.id, { ...discount });
    });
  }

  findAllActiveDiscounts(): Discount[] {
    return Array.from(this.discountStore.values()).filter(
      (discount) => discount.isActive,
    );
  }

  findDiscountById(discountId: string): Discount | undefined {
    return this.discountStore.get(discountId);
  }
}
