import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from '../application/ProductsService';
import { ProductListResponseDto } from '../application/dto/ProductListResponseDto';
import { ProductResponseDto } from '../application/dto/ProductResponseDto';

/**
 * Controller handling all product-related HTTP endpoints.
 * Provides access to the product catalogue; returns product information
 * with current stock availability calculated in real-time.
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Retrieves the complete product catalogue.
   * Returns all products with their current availability status.
   *
   * @returns List of all products with total count
   */
  @Get()
  getAllProductsWithCurrentAvailability(): ProductListResponseDto {
    return this.productsService.getAllProductsWithCurrentAvailability();
  }

  /**
   * Retrieves detailed information for a specific product.
   * Includes current stock availability and full product details.
   *
   * @param productId - The unique identifier of the product
   * @returns Detailed product information
   * @throws AppError with PRODUCT_NOT_FOUND if product does not exist
   */
  @Get(':productId')
  getProductDetailByIdWithAvailability(
    @Param('productId') productId: string,
  ): ProductResponseDto {
    return this.productsService.getProductDetailByIdWithAvailability(
      productId,
    );
  }
}
