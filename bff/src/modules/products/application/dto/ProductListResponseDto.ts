import { ProductResponseDto } from './ProductResponseDto';

export class ProductListResponseDto {
  products: ProductResponseDto[];
  totalCount: number;
}
