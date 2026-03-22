import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { DiscountsModule } from './modules/discounts/discounts.module';

@Module({
  imports: [ProductsModule, DiscountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
