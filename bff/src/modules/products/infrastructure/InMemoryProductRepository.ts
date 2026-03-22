import { Injectable } from '@nestjs/common';
import { Product } from '../domain/Product.entity';
import { IProductRepository } from '../domain/IProductRepository';
import { seedProducts } from '../data/seedProducts';
import { AppError } from '../../../shared/errors/AppError';
import { ErrorCode } from '../../../shared/errors/ErrorCode.enum';

/**
 * In-memory implementation of the product repository.
 * Stores all products in a Map; initialised with seed data on construction.
 * Manages stock levels and reservations for all products throughout the application lifecycle.
 */
@Injectable()
export class InMemoryProductRepository implements IProductRepository {
  private readonly productStore: Map<string, Product>;

  constructor() {
    this.productStore = new Map<string, Product>();
    seedProducts.forEach((product) => {
      this.productStore.set(product.id, { ...product });
    });
  }

  findAllProducts(): Product[] {
    return Array.from(this.productStore.values());
  }

  findProductByIdOrThrow(productId: string): Product {
    const product = this.productStore.get(productId);
    if (!product) {
      throw new AppError(
        404,
        ErrorCode.PRODUCT_NOT_FOUND,
        'The requested product could not be found.',
      );
    }
    return product;
  }

  reserveStockForProduct(productId: string, quantity: number): void {
    const product = this.findProductByIdOrThrow(productId);
    const availableStock = product.stockLevel - product.reservedStock;

    if (availableStock < quantity) {
      throw new AppError(
        409,
        ErrorCode.INSUFFICIENT_STOCK_FOR_PRODUCT,
        'Insufficient stock available for this product; please reduce the quantity.',
      );
    }

    product.reservedStock += quantity;
  }

  releaseReservedStockForProduct(productId: string, quantity: number): void {
    const product = this.findProductByIdOrThrow(productId);
    product.reservedStock = Math.max(0, product.reservedStock - quantity);
  }

  deductStockAfterSuccessfulPurchase(
    productId: string,
    quantity: number,
  ): void {
    const product = this.findProductByIdOrThrow(productId);
    product.stockLevel -= quantity;
    product.reservedStock -= quantity;
  }
}
