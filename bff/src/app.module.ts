import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './modules/products/products.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/checkout/checkout.module';

@Module({
  imports: [
    SharedModule,
    ProductsModule,
    DiscountsModule,
    CartModule,
    CheckoutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
