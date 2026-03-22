import { Module } from '@nestjs/common';
import { CartController } from './presentation/CartController';
import { CartService } from './application/CartService';
import { InMemoryCartRepository } from './infrastructure/InMemoryCartRepository';
import { CART_REPOSITORY_TOKEN } from './domain/ICartRepository';
import { ProductsModule } from '../products/products.module';

/**
 * Cart module encapsulating all shopping cart functionality.
 * Provides the cart repository as an injectable dependency using the
 * repository interface token pattern; imports ProductsModule to access
 * product operations for stock validation and reservation. Exports CartService
 * for use by the checkout module.
 */
@Module({
  imports: [ProductsModule],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CART_REPOSITORY_TOKEN,
      useClass: InMemoryCartRepository,
    },
  ],
  exports: [CartService, CART_REPOSITORY_TOKEN],
})
export class CartModule {}
