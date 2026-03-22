import { Module } from '@nestjs/common';
import { ProductsController } from './presentation/ProductsController';
import { ProductsService } from './application/ProductsService';
import { InMemoryProductRepository } from './infrastructure/InMemoryProductRepository';
import { PRODUCT_REPOSITORY_TOKEN } from './domain/IProductRepository';

/**
 * Products module encapsulating all product-related functionality.
 * Provides the product repository as an injectable dependency using the
 * repository interface token pattern; exports ProductsService for use
 * by other modules that need product operations.
 */
@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: InMemoryProductRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
