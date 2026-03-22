import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [ProductsModule, DiscountsModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
