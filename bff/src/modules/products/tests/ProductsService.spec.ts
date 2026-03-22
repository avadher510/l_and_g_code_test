import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../application/ProductsService';
import type { IProductRepository } from '../domain/IProductRepository';
import { PRODUCT_REPOSITORY_TOKEN } from '../domain/IProductRepository';
import { Product, ProductCategory } from '../domain/Product.entity';
import { AppError } from '../../../shared/errors/AppError';
import { ErrorCode } from '../../../shared/errors/ErrorCode.enum';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository: jest.Mocked<IProductRepository>;

  const mockProduct: Product = {
    id: 'prod-001',
    name: 'Test Product',
    description: 'Test description',
    priceInPence: 1000,
    category: ProductCategory.ELECTRONICS,
    stockLevel: 10,
    reservedStock: 0,
    imageUrl: 'https://example.com/image.jpg',
  };

  beforeEach(async () => {
    mockRepository = {
      findAllProducts: jest.fn(),
      findProductByIdOrThrow: jest.fn(),
      reserveStockForProduct: jest.fn(),
      releaseReservedStockForProduct: jest.fn(),
      deductStockAfterSuccessfulPurchase: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PRODUCT_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('getAllProductsWithCurrentAvailability', () => {
    it('should return all 6 products', () => {
      const products: Product[] = [
        mockProduct,
        { ...mockProduct, id: 'prod-002' },
        { ...mockProduct, id: 'prod-003' },
        { ...mockProduct, id: 'prod-004' },
        { ...mockProduct, id: 'prod-005' },
        { ...mockProduct, id: 'prod-006' },
      ];
      mockRepository.findAllProducts.mockReturnValue(products);

      const result = service.getAllProductsWithCurrentAvailability();

      expect(result.products).toHaveLength(6);
      expect(result.totalCount).toBe(6);
    });

    it('should compute availableStock as stockLevel minus reservedStock', () => {
      const productWithReservation: Product = {
        ...mockProduct,
        stockLevel: 10,
        reservedStock: 3,
      };
      mockRepository.findAllProducts.mockReturnValue([productWithReservation]);

      const result = service.getAllProductsWithCurrentAvailability();

      expect(result.products[0].availableStock).toBe(7);
      expect(result.products[0].totalStock).toBe(10);
    });
  });

  describe('getProductDetailByIdWithAvailability', () => {
    it('should return correct product for valid id', () => {
      mockRepository.findProductByIdOrThrow.mockReturnValue(mockProduct);

      const result = service.getProductDetailByIdWithAvailability('prod-001');

      expect(result.id).toBe('prod-001');
      expect(result.name).toBe('Test Product');
      expect(result.availableStock).toBe(10);
    });

    it('should throw PRODUCT_NOT_FOUND for unknown id', () => {
      mockRepository.findProductByIdOrThrow.mockImplementation(() => {
        throw new AppError(
          404,
          ErrorCode.PRODUCT_NOT_FOUND,
          'The requested product could not be found.',
        );
      });

      expect(() =>
        service.getProductDetailByIdWithAvailability('nonexistent'),
      ).toThrow(AppError);
    });
  });

  describe('validateSufficientStockForAllCartItems', () => {
    it('should return empty array when all stock is available', () => {
      const cartItems = [
        {
          productId: 'prod-001',
          productName: 'Test Product',
          unitPriceInPence: 1000,
          quantity: 5,
        },
      ];
      mockRepository.findProductByIdOrThrow.mockReturnValue(mockProduct);

      const result = service.validateSufficientStockForAllCartItems(cartItems);

      expect(result).toEqual([]);
    });

    it('should return an InsufficientStockDetail for each failing item', () => {
      const cartItems = [
        {
          productId: 'prod-001',
          productName: 'Test Product',
          unitPriceInPence: 1000,
          quantity: 15,
        },
      ];
      mockRepository.findProductByIdOrThrow.mockReturnValue(mockProduct);

      const result = service.validateSufficientStockForAllCartItems(cartItems);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        productId: 'prod-001',
        productName: 'Test Product',
        requestedQuantity: 15,
        availableQuantity: 10,
      });
    });
  });

  describe('reserveStockForAllCartItems', () => {
    it('should call the repository once per cart item', () => {
      const cartItems = [
        {
          productId: 'prod-001',
          productName: 'Test Product',
          unitPriceInPence: 1000,
          quantity: 2,
        },
        {
          productId: 'prod-002',
          productName: 'Another Product',
          unitPriceInPence: 2000,
          quantity: 3,
        },
      ];

      service.reserveStockForAllCartItems(cartItems);

      expect(mockRepository.reserveStockForProduct).toHaveBeenCalledTimes(2);
      expect(mockRepository.reserveStockForProduct).toHaveBeenCalledWith(
        'prod-001',
        2,
      );
      expect(mockRepository.reserveStockForProduct).toHaveBeenCalledWith(
        'prod-002',
        3,
      );
    });
  });
});
