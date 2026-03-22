import { Injectable, Inject } from '@nestjs/common';
import type { ICartRepository } from '../domain/ICartRepository';
import { CART_REPOSITORY_TOKEN } from '../domain/ICartRepository';
import type { IProductRepository } from '../../products/domain/IProductRepository';
import { PRODUCT_REPOSITORY_TOKEN } from '../../products/domain/IProductRepository';
import { CartResponseDto } from './dto/CartResponseDto';
import { Cart, CartStatus } from '../domain/Cart.entity';
import { AppError } from '../../../shared/errors/AppError';
import { ErrorCode } from '../../../shared/errors/ErrorCode.enum';

/**
 * Service responsible for managing shopping cart operations.
 * Handles cart lifecycle including creation, item management, and status validation;
 * coordinates with the product repository to manage stock reservations throughout
 * the shopping session. All cart operations update the last activity timestamp
 * to support inactivity-based expiry.
 */
@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY_TOKEN)
    private readonly cartRepository: ICartRepository,
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  /**
   * Creates a new empty shopping cart.
   * Initialises the cart with ACTIVE status and current timestamps;
   * returns the cart ready for items to be added.
   *
   * @returns A new empty cart with ACTIVE status
   */
  initiateNewShoppingCart(): CartResponseDto {
    const cart = this.cartRepository.createNewEmptyCart();
    return this.mapCartToResponseDto(cart);
  }

  /**
   * Retrieves an active cart by its unique identifier.
   * Validates that the cart exists and is in an active state;
   * throws appropriate errors for expired or checked-out carts.
   *
   * @param cartId - The unique identifier of the cart to retrieve
   * @returns The active cart with current contents
   * @throws AppError with CART_NOT_FOUND if cart does not exist
   * @throws AppError with CART_EXPIRED if cart has expired
   * @throws AppError with CART_ALREADY_CHECKED_OUT if cart has been checked out
   */
  retrieveActiveCartByIdOrThrow(cartId: string): CartResponseDto {
    const cart = this.cartRepository.findCartByIdOrThrow(cartId);

    if (cart.status === CartStatus.EXPIRED) {
      throw new AppError(
        410,
        ErrorCode.CART_EXPIRED,
        'This cart has expired due to inactivity; your reserved stock has been released.',
      );
    }

    if (cart.status === CartStatus.CHECKED_OUT) {
      throw new AppError(
        409,
        ErrorCode.CART_ALREADY_CHECKED_OUT,
        'This cart has already been checked out; please start a new shopping session.',
      );
    }

    return this.mapCartToResponseDto(cart);
  }

  /**
   * Adds a product to an active cart or increments the quantity if already present.
   * Validates product availability, reserves stock, and updates cart activity timestamp.
   *
   * @param cartId - The unique identifier of the cart
   * @param productId - The unique identifier of the product to add
   * @param quantity - The quantity to add to the cart
   * @returns The updated cart with the new item
   * @throws AppError with CART_NOT_FOUND, CART_EXPIRED, or CART_ALREADY_CHECKED_OUT
   * @throws AppError with PRODUCT_NOT_FOUND if product does not exist
   * @throws AppError with INSUFFICIENT_STOCK_FOR_PRODUCT if stock is unavailable
   */
  addProductToActiveCart(
    cartId: string,
    productId: string,
    quantity: number,
  ): CartResponseDto {
    this.retrieveActiveCartByIdOrThrow(cartId);

    const product = this.productRepository.findProductByIdOrThrow(productId);
    const availableStock = product.stockLevel - product.reservedStock;

    if (availableStock < quantity) {
      throw new AppError(
        409,
        ErrorCode.INSUFFICIENT_STOCK_FOR_PRODUCT,
        'Insufficient stock available for this product; please reduce the quantity.',
      );
    }

    this.productRepository.reserveStockForProduct(productId, quantity);

    const updatedCart = this.cartRepository.addItemToCartOrIncrementExistingQuantity(
      cartId,
      productId,
      product.name,
      product.priceInPence,
      quantity,
    );

    this.cartRepository.updateCartLastActivityTimestamp(cartId);

    return this.mapCartToResponseDto(updatedCart);
  }

  /**
   * Updates the quantity of an existing item in the cart.
   * Calculates the delta between old and new quantities; reserves additional stock
   * if increasing or releases stock if decreasing. Updates cart activity timestamp.
   *
   * @param cartId - The unique identifier of the cart
   * @param productId - The unique identifier of the product to update
   * @param newQuantity - The new quantity for the item
   * @returns The updated cart with modified item quantity
   * @throws AppError with CART_NOT_FOUND, CART_EXPIRED, or CART_ALREADY_CHECKED_OUT
   * @throws AppError with PRODUCT_NOT_IN_CART if product is not in the cart
   * @throws AppError with INSUFFICIENT_STOCK_FOR_PRODUCT if additional stock is unavailable
   */
  updateProductQuantityInActiveCart(
    cartId: string,
    productId: string,
    newQuantity: number,
  ): CartResponseDto {
    const cart = this.cartRepository.findCartByIdOrThrow(cartId);

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (!existingItem) {
      throw new AppError(
        404,
        ErrorCode.PRODUCT_NOT_IN_CART,
        'The specified product is not in the cart.',
      );
    }

    const quantityDelta = newQuantity - existingItem.quantity;

    if (quantityDelta > 0) {
      this.productRepository.reserveStockForProduct(productId, quantityDelta);
    } else if (quantityDelta < 0) {
      this.productRepository.releaseReservedStockForProduct(
        productId,
        Math.abs(quantityDelta),
      );
    }

    const updatedCart = this.cartRepository.updateQuantityForExistingCartItem(
      cartId,
      productId,
      newQuantity,
    );

    this.cartRepository.updateCartLastActivityTimestamp(cartId);

    return this.mapCartToResponseDto(updatedCart);
  }

  /**
   * Removes a product from the cart entirely.
   * Releases all reserved stock for the removed item and updates cart activity timestamp.
   *
   * @param cartId - The unique identifier of the cart
   * @param productId - The unique identifier of the product to remove
   * @returns The updated cart without the removed item
   * @throws AppError with CART_NOT_FOUND, CART_EXPIRED, or CART_ALREADY_CHECKED_OUT
   * @throws AppError with PRODUCT_NOT_IN_CART if product is not in the cart
   */
  removeProductFromActiveCart(
    cartId: string,
    productId: string,
  ): CartResponseDto {
    const cart = this.cartRepository.findCartByIdOrThrow(cartId);

    const itemToRemove = cart.items.find(
      (item) => item.productId === productId,
    );

    if (!itemToRemove) {
      throw new AppError(
        404,
        ErrorCode.PRODUCT_NOT_IN_CART,
        'The specified product is not in the cart.',
      );
    }

    this.productRepository.releaseReservedStockForProduct(
      productId,
      itemToRemove.quantity,
    );

    const updatedCart = this.cartRepository.removeItemFromCartById(
      cartId,
      productId,
    );

    this.cartRepository.updateCartLastActivityTimestamp(cartId);

    return this.mapCartToResponseDto(updatedCart);
  }

  /**
   * Expires a cart and releases all stock reservations.
   * Called by the scheduler when a cart has been inactive beyond the timeout threshold;
   * marks the cart as EXPIRED and releases reserved stock for all items.
   *
   * @param cartId - The unique identifier of the cart to expire
   */
  expireCartAndReleaseAllStockReservations(cartId: string): void {
    const cart = this.cartRepository.findCartByIdOrThrow(cartId);

    for (const item of cart.items) {
      this.productRepository.releaseReservedStockForProduct(
        item.productId,
        item.quantity,
      );
    }

    this.cartRepository.markCartStatusAsExpired(cartId);
  }

  private mapCartToResponseDto(cart: Cart): CartResponseDto {
    const totalItemCount = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const subtotalInPence = cart.items.reduce(
      (sum, item) => sum + item.unitPriceInPence * item.quantity,
      0,
    );

    return {
      id: cart.id,
      items: cart.items,
      totalItemCount,
      subtotalInPence,
      status: cart.status,
      createdAt: cart.createdAt,
      lastActivityAt: cart.lastActivityAt,
    };
  }
}
