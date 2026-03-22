import { Module } from '@nestjs/common';
import { CheckoutController } from './presentation/CheckoutController';
import { CheckoutService } from './application/CheckoutService';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsModule } from '../discounts/discounts.module';

/**
 * Checkout module encapsulating all checkout functionality.
 * Imports Cart, Products, and Discounts modules to coordinate the complete
 * checkout flow including stock validation, discount calculation, and order
 * finalisation. Provides CheckoutService for processing cart checkouts.
 */
@Module({
  imports: [CartModule, ProductsModule, DiscountsModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
