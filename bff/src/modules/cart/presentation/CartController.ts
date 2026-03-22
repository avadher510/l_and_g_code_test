import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { CartService } from '../application/CartService';
import { CartResponseDto } from '../application/dto/CartResponseDto';
import { AddItemToCartDto } from '../application/dto/AddItemToCartDto';
import { UpdateCartItemQuantityDto } from '../application/dto/UpdateCartItemQuantityDto';

/**
 * Controller handling all shopping cart HTTP endpoints.
 * Provides operations for cart creation, item management, and cart retrieval;
 * coordinates stock reservations through the cart service layer.
 */
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Creates a new empty shopping cart.
   * Returns a cart with ACTIVE status ready for items to be added.
   *
   * @returns A new empty cart
   */
  @Post()
  initiateNewShoppingCart(): CartResponseDto {
    return this.cartService.initiateNewShoppingCart();
  }

  /**
   * Retrieves an active cart by its unique identifier.
   * Returns cart contents with current item counts and subtotal.
   *
   * @param cartId - The unique identifier of the cart
   * @returns The active cart with all items
   * @throws AppError if cart is not found, expired, or checked out
   */
  @Get(':cartId')
  retrieveActiveCartByIdOrThrow(
    @Param('cartId') cartId: string,
  ): CartResponseDto {
    return this.cartService.retrieveActiveCartByIdOrThrow(cartId);
  }

  /**
   * Adds a product to the cart or increments quantity if already present.
   * Reserves stock for the added quantity.
   *
   * @param cartId - The unique identifier of the cart
   * @param addItemDto - The product ID and quantity to add
   * @returns The updated cart with the new item
   * @throws AppError if cart is invalid, product not found, or insufficient stock
   */
  @Post(':cartId/items')
  addProductToActiveCart(
    @Param('cartId') cartId: string,
    @Body() addItemDto: AddItemToCartDto,
  ): CartResponseDto {
    return this.cartService.addProductToActiveCart(
      cartId,
      addItemDto.productId,
      addItemDto.quantity,
    );
  }

  /**
   * Updates the quantity of an existing item in the cart.
   * Adjusts stock reservations based on the quantity delta.
   *
   * @param cartId - The unique identifier of the cart
   * @param productId - The unique identifier of the product to update
   * @param updateQuantityDto - The new quantity for the item
   * @returns The updated cart with modified item quantity
   * @throws AppError if cart is invalid, product not in cart, or insufficient stock
   */
  @Patch(':cartId/items/:productId')
  updateProductQuantityInActiveCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() updateQuantityDto: UpdateCartItemQuantityDto,
  ): CartResponseDto {
    return this.cartService.updateProductQuantityInActiveCart(
      cartId,
      productId,
      updateQuantityDto.quantity,
    );
  }

  /**
   * Removes a product from the cart entirely.
   * Releases all reserved stock for the removed item.
   *
   * @param cartId - The unique identifier of the cart
   * @param productId - The unique identifier of the product to remove
   * @returns The updated cart without the removed item
   * @throws AppError if cart is invalid or product not in cart
   */
  @Delete(':cartId/items/:productId')
  removeProductFromActiveCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ): CartResponseDto {
    return this.cartService.removeProductFromActiveCart(cartId, productId);
  }
}
