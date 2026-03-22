import { Product, ProductCategory } from '../domain/Product.entity';

export const seedProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Sony WH-1000XM5 Headphones',
    category: ProductCategory.ELECTRONICS,
    priceInPence: 27999,
    stockLevel: 15,
    reservedStock: 0,
    description:
      'Industry-leading noise-cancelling headphones with exceptional sound quality and all-day comfort.',
    imageUrl: 'https://via.placeholder.com/300x300?text=Sony+Headphones',
  },
  {
    id: 'prod-002',
    name: "Levi's 501 Original Jeans",
    category: ProductCategory.CLOTHING,
    priceInPence: 8999,
    stockLevel: 30,
    reservedStock: 0,
    description:
      'The original straight-fit jeans; iconic style crafted from premium denim.',
    imageUrl: 'https://via.placeholder.com/300x300?text=Levis+Jeans',
  },
  {
    id: 'prod-003',
    name: 'Instant Pot Duo 7-in-1 Pressure Cooker',
    category: ProductCategory.HOME,
    priceInPence: 7999,
    stockLevel: 8,
    reservedStock: 0,
    description:
      'A versatile kitchen appliance that replaces seven separate devices; ideal for busy households.',
    imageUrl: 'https://via.placeholder.com/300x300?text=Instant+Pot',
  },
  {
    id: 'prod-004',
    name: 'Organic Arabica Coffee Beans 1kg',
    category: ProductCategory.FOOD,
    priceInPence: 1299,
    stockLevel: 50,
    reservedStock: 0,
    description:
      'Ethically sourced, single-origin Arabica beans with a rich, smooth flavour.',
    imageUrl: 'https://via.placeholder.com/300x300?text=Coffee+Beans',
  },
  {
    id: 'prod-005',
    name: 'Nike Air Zoom Pegasus 40 Running Shoes',
    category: ProductCategory.SPORTS,
    priceInPence: 12499,
    stockLevel: 20,
    reservedStock: 0,
    description:
      'Responsive cushioning and a breathable upper; built for everyday training and long-distance runs.',
    imageUrl: 'https://via.placeholder.com/300x300?text=Nike+Shoes',
  },
  {
    id: 'prod-006',
    name: 'Apple AirPods Pro 2nd Generation',
    category: ProductCategory.ELECTRONICS,
    priceInPence: 24900,
    stockLevel: 10,
    reservedStock: 0,
    description:
      'Active noise cancellation, adaptive transparency, and spatial audio in a compact wireless design.',
    imageUrl: 'https://via.placeholder.com/300x300?text=AirPods+Pro',
  },
];
