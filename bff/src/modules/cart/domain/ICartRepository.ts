import { Cart } from './Cart.entity';

export const CART_REPOSITORY_TOKEN = 'ICartRepository';

export interface ICartRepository {
  createNewEmptyCart(): Cart;
  findCartByIdOrThrow(cartId: string): Cart;
  findAllActiveCartsWithLastActivityBefore(cutoffDate: Date): Cart[];
  addItemToCartOrIncrementExistingQuantity(
    cartId: string,
    productId: string,
    productName: string,
    unitPriceInPence: number,
    quantity: number,
  ): Cart;
  updateQuantityForExistingCartItem(
    cartId: string,
    productId: string,
    newQuantity: number,
  ): Cart;
  removeItemFromCartById(cartId: string, productId: string): Cart;
  updateCartLastActivityTimestamp(cartId: string): void;
  markCartStatusAsExpired(cartId: string): void;
  markCartStatusAsCheckedOut(cartId: string): void;
}
