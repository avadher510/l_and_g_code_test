import { Injectable, Inject } from '@nestjs/common';
import type { IProductRepository } from '../domain/IProductRepository';
import { PRODUCT_REPOSITORY_TOKEN } from '../domain/IProductRepository';
import { ProductResponseDto } from './dto/ProductResponseDto';
import { ProductListResponseDto } from './dto/ProductListResponseDto';
import { Product } from '../domain/Product.entity';

export interface CartItem {
  productId: string;
  productName: string;
  unitPriceInPence: number;
  quantity: number;
}

export interface InsufficientStockDetail {
  productId: string;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
}

/**
 * Service responsible for managing product catalogue operations.
 * Provides methods to retrieve product information with current availability;
 * validates stock levels for cart items; manages stock reservations and deductions
 * throughout the shopping and checkout process.
 */
@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  /**
   * Retrieves all products in the catalogue with their current availability.
   * Calculates available stock as the difference between total stock level
   * and currently reserved stock for each product.
   *
   * @returns A list of all products with availability information and total count
   */
  getAllProductsWithCurrentAvailability(): ProductListResponseDto {
    const products = this.productRepository.findAllProducts();
    const productDtos = products.map((product) =>
      this.mapProductToResponseDto(product),
    );

    return {
      products: productDtos,
      totalCount: productDtos.length,
    };
  }

  /**
   * Retrieves detailed information for a single product by its unique identifier.
   * Includes current availability calculated from stock level and reservations.
   *
   * @param productId - The unique identifier of the product to retrieve
   * @returns Detailed product information with current availability
   * @throws AppError with PRODUCT_NOT_FOUND if the product does not exist
   */
  getProductDetailByIdWithAvailability(productId: string): ProductResponseDto {
    const product = this.productRepository.findProductByIdOrThrow(productId);
    return this.mapProductToResponseDto(product);
  }

  /**
   * Validates that sufficient stock is available for all items in a cart.
   * Checks each cart item against current available stock; returns details
   * for any items that cannot be fulfilled due to insufficient stock.
   *
   * @param items - Array of cart items to validate
   * @returns Array of items with insufficient stock; empty array if all items can be fulfilled
   */
  validateSufficientStockForAllCartItems(
    items: CartItem[],
  ): InsufficientStockDetail[] {
    const insufficientStockItems: InsufficientStockDetail[] = [];

    for (const item of items) {
      const product = this.productRepository.findProductByIdOrThrow(
        item.productId,
      );
      const availableStock = product.stockLevel - product.reservedStock;

      if (availableStock < item.quantity) {
        insufficientStockItems.push({
          productId: item.productId,
          productName: item.productName,
          requestedQuantity: item.quantity,
          availableQuantity: availableStock,
        });
      }
    }

    return insufficientStockItems;
  }

  /**
   * Reserves stock for all items in a cart.
   * Increments the reserved stock count for each product; ensures that
   * stock is held while the customer completes their shopping session.
   *
   * @param items - Array of cart items for which to reserve stock
   * @throws AppError with INSUFFICIENT_STOCK_FOR_PRODUCT if any item cannot be reserved
   */
  reserveStockForAllCartItems(items: CartItem[]): void {
    for (const item of items) {
      this.productRepository.reserveStockForProduct(
        item.productId,
        item.quantity,
      );
    }
  }

  /**
   * Releases previously reserved stock for all items in a cart.
   * Decrements the reserved stock count for each product; typically called
   * when a cart expires or when an item is removed from the cart.
   *
   * @param items - Array of cart items for which to release reserved stock
   */
  releaseStockReservationForAllCartItems(items: CartItem[]): void {
    for (const item of items) {
      this.productRepository.releaseReservedStockForProduct(
        item.productId,
        item.quantity,
      );
    }
  }

  /**
   * Deducts stock levels after a successful purchase.
   * Reduces both the total stock level and the reserved stock count for each product;
   * called only after checkout has been confirmed and payment processed.
   *
   * @param items - Array of purchased items for which to deduct stock
   */
  deductStockForAllPurchasedItems(items: CartItem[]): void {
    for (const item of items) {
      this.productRepository.deductStockAfterSuccessfulPurchase(
        item.productId,
        item.quantity,
      );
    }
  }

  private mapProductToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      priceInPence: product.priceInPence,
      category: product.category,
      availableStock: product.stockLevel - product.reservedStock,
      totalStock: product.stockLevel,
      imageUrl: product.imageUrl,
    };
  }
}
