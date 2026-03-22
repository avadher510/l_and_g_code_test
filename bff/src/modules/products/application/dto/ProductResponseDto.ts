import { ProductCategory } from '../../domain/Product.entity';

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  priceInPence: number;
  category: ProductCategory;
  availableStock: number;
  totalStock: number;
  imageUrl: string;
}
