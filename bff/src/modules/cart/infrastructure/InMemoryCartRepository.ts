import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Cart, CartStatus } from '../domain/Cart.entity';
import type { ICartRepository } from '../domain/ICartRepository';
import { AppError } from '../../../shared/errors/AppError';
import { ErrorCode } from '../../../shared/errors/ErrorCode.enum';

/**
 * In-memory implementation of the cart repository.
 * Stores all active shopping carts in a Map; manages cart lifecycle including
 * creation, item management, status transitions, and expiry tracking.
 */
@Injectable()
export class InMemoryCartRepository implements ICartRepository {
  private readonly cartStore: Map<string, Cart>;

  constructor() {
    this.cartStore = new Map<string, Cart>();
  }

  createNewEmptyCart(): Cart {
    const cart: Cart = {
      id: uuidv4(),
      items: [],
      createdAt: new Date(),
      lastActivityAt: new Date(),
      status: CartStatus.ACTIVE,
    };

    this.cartStore.set(cart.id, cart);
    return cart;
  }

  findCartByIdOrThrow(cartId: string): Cart {
    const cart = this.cartStore.get(cartId);
    if (!cart) {
      throw new AppError(
        404,
        ErrorCode.CART_NOT_FOUND,
        'No cart was found with the provided ID; please start a new shopping session.',
      );
    }
    return cart;
  }

  findAllActiveCartsWithLastActivityBefore(cutoffDate: Date): Cart[] {
    return Array.from(this.cartStore.values()).filter(
      (cart) =>
        cart.status === CartStatus.ACTIVE &&
        cart.lastActivityAt < cutoffDate,
    );
  }

  addItemToCartOrIncrementExistingQuantity(
    cartId: string,
    productId: string,
    productName: string,
    unitPriceInPence: number,
    quantity: number,
  ): Cart {
    const cart = this.findCartByIdOrThrow(cartId);

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        productName,
        unitPriceInPence,
        quantity,
      });
    }

    return cart;
  }

  updateQuantityForExistingCartItem(
    cartId: string,
    productId: string,
    newQuantity: number,
  ): Cart {
    const cart = this.findCartByIdOrThrow(cartId);

    const item = cart.items.find((item) => item.productId === productId);
    if (!item) {
      throw new AppError(
        404,
        ErrorCode.PRODUCT_NOT_IN_CART,
        'The specified product is not in the cart.',
      );
    }

    item.quantity = newQuantity;
    return cart;
  }

  removeItemFromCartById(cartId: string, productId: string): Cart {
    const cart = this.findCartByIdOrThrow(cartId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new AppError(
        404,
        ErrorCode.PRODUCT_NOT_IN_CART,
        'The specified product is not in the cart.',
      );
    }

    cart.items.splice(itemIndex, 1);
    return cart;
  }

  updateCartLastActivityTimestamp(cartId: string): void {
    const cart = this.findCartByIdOrThrow(cartId);
    cart.lastActivityAt = new Date();
  }

  markCartStatusAsExpired(cartId: string): void {
    const cart = this.findCartByIdOrThrow(cartId);
    cart.status = CartStatus.EXPIRED;
  }

  markCartStatusAsCheckedOut(cartId: string): void {
    const cart = this.findCartByIdOrThrow(cartId);
    cart.status = CartStatus.CHECKED_OUT;
  }
}
