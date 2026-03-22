import { Product } from './Product.entity';

export const PRODUCT_REPOSITORY_TOKEN = 'IProductRepository';

export interface IProductRepository {
  findAllProducts(): Product[];
  findProductByIdOrThrow(productId: string): Product;
  reserveStockForProduct(productId: string, quantity: number): void;
  releaseReservedStockForProduct(productId: string, quantity: number): void;
  deductStockAfterSuccessfulPurchase(productId: string, quantity: number): void;
}
