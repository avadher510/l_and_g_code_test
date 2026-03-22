export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  CLOTHING = 'CLOTHING',
  FOOD = 'FOOD',
  HOME = 'HOME',
  SPORTS = 'SPORTS',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInPence: number;
  category: ProductCategory;
  stockLevel: number;
  reservedStock: number;
  imageUrl: string;
}
