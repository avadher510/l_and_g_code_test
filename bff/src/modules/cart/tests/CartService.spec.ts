import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../application/CartService';
import type { ICartRepository } from '../domain/ICartRepository';
import { CART_REPOSITORY_TOKEN } from '../domain/ICartRepository';
import type { IProductRepository } from '../../products/domain/IProductRepository';
import { PRODUCT_REPOSITORY_TOKEN } from '../../products/domain/IProductRepository';
import { Cart, CartStatus } from '../domain/Cart.entity';
import { Product, ProductCategory } from '../../products/domain/Product.entity';
import { AppError } from '../../../shared/errors/AppError';
import { ErrorCode } from '../../../shared/errors/ErrorCode.enum';

describe('CartService', () => {
  let service: CartService;
  let mockCartRepository: jest.Mocked<ICartRepository>;
  let mockProductRepository: jest.Mocked<IProductRepository>;

  const mockCart: Cart = {
    id: 'cart-001',
    items: [],
    createdAt: new Date(),
    lastActivityAt: new Date(),
    status: CartStatus.ACTIVE,
  };

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
    mockCartRepository = {
      createNewEmptyCart: jest.fn(),
      findCartByIdOrThrow: jest.fn(),
      findAllActiveCartsWithLastActivityBefore: jest.fn(),
      addItemToCartOrIncrementExistingQuantity: jest.fn(),
      updateQuantityForExistingCartItem: jest.fn(),
      removeItemFromCartById: jest.fn(),
      updateCartLastActivityTimestamp: jest.fn(),
      markCartStatusAsExpired: jest.fn(),
      markCartStatusAsCheckedOut: jest.fn(),
    };

    mockProductRepository = {
      findAllProducts: jest.fn(),
      findProductByIdOrThrow: jest.fn(),
      reserveStockForProduct: jest.fn(),
      releaseReservedStockForProduct: jest.fn(),
      deductStockAfterSuccessfulPurchase: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CART_REPOSITORY_TOKEN,
          useValue: mockCartRepository,
        },
        {
          provide: PRODUCT_REPOSITORY_TOKEN,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('initiateNewShoppingCart', () => {
    it('should create a cart with ACTIVE status and an empty items array', () => {
      mockCartRepository.createNewEmptyCart.mockReturnValue(mockCart);

      const result = service.initiateNewShoppingCart();

      expect(result.status).toBe(CartStatus.ACTIVE);
      expect(result.items).toEqual([]);
      expect(result.totalItemCount).toBe(0);
      expect(result.subtotalInPence).toBe(0);
    });
  });

  describe('addProductToActiveCart', () => {
    it('should successfully add an item and reserve the correct stock', () => {
      const cartWithItem: Cart = {
        ...mockCart,
        items: [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            unitPriceInPence: 1000,
            quantity: 2,
          },
        ],
      };

      mockCartRepository.findCartByIdOrThrow.mockReturnValue(mockCart);
      mockProductRepository.findProductByIdOrThrow.mockReturnValue(mockProduct);
      mockCartRepository.addItemToCartOrIncrementExistingQuantity.mockReturnValue(
        cartWithItem,
      );

      const result = service.addProductToActiveCart('cart-001', 'prod-001', 2);

      expect(mockProductRepository.reserveStockForProduct).toHaveBeenCalledWith(
        'prod-001',
        2,
      );
      expect(result.items).toHaveLength(1);
      expect(result.totalItemCount).toBe(2);
    });

    it('should throw INSUFFICIENT_STOCK_FOR_PRODUCT when available stock is 0', () => {
      const productWithNoStock: Product = {
        ...mockProduct,
        stockLevel: 5,
        reservedStock: 5,
      };

      mockCartRepository.findCartByIdOrThrow.mockReturnValue(mockCart);
      mockProductRepository.findProductByIdOrThrow.mockReturnValue(
        productWithNoStock,
      );

      expect(() =>
        service.addProductToActiveCart('cart-001', 'prod-001', 1),
      ).toThrow(AppError);
    });

    it('should throw CART_NOT_FOUND when the cart does not exist', () => {
      mockCartRepository.findCartByIdOrThrow.mockImplementation(() => {
        throw new AppError(
          404,
          ErrorCode.CART_NOT_FOUND,
          'No cart was found with the provided ID; please start a new shopping session.',
        );
      });

      expect(() =>
        service.addProductToActiveCart('nonexistent', 'prod-001', 1),
      ).toThrow(AppError);
    });
  });

  describe('updateProductQuantityInActiveCart', () => {
    it('should reserve the delta when increasing quantity', () => {
      const cartWithItem: Cart = {
        ...mockCart,
        items: [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            unitPriceInPence: 1000,
            quantity: 2,
          },
        ],
      };

      const updatedCart: Cart = {
        ...cartWithItem,
        items: [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            unitPriceInPence: 1000,
            quantity: 5,
          },
        ],
      };

      mockCartRepository.findCartByIdOrThrow.mockReturnValue(cartWithItem);
      mockCartRepository.updateQuantityForExistingCartItem.mockReturnValue(
        updatedCart,
      );

      service.updateProductQuantityInActiveCart('cart-001', 'prod-001', 5);

      expect(mockProductRepository.reserveStockForProduct).toHaveBeenCalledWith(
        'prod-001',
        3,
      );
    });

    it('should release the delta when decreasing quantity', () => {
      const cartWithItem: Cart = {
        ...mockCart,
        items: [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            unitPriceInPence: 1000,
            quantity: 5,
          },
        ],
      };

      const updatedCart: Cart = {
        ...cartWithItem,
        items: [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            unitPriceInPence: 1000,
            quantity: 2,
          },
        ],
      };

      mockCartRepository.findCartByIdOrThrow.mockReturnValue(cartWithItem);
      mockCartRepository.updateQuantityForExistingCartItem.mockReturnValue(
        updatedCart,
      );

      service.updateProductQuantityInActiveCart('cart-001', 'prod-001', 2);

      expect(
        mockProductRepository.releaseReservedStockForProduct,
      ).toHaveBeenCalledWith('prod-001', 3);
    });
  });

  describe('removeProductFromActiveCart', () => {
    it('should release all reserved stock for the removed item', () => {
      const cartWithItem: Cart = {
        ...mockCart,
        items: [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            unitPriceInPence: 1000,
            quantity: 3,
          },
        ],
      };

      mockCartRepository.findCartByIdOrThrow.mockReturnValue(cartWithItem);
      mockCartRepository.removeItemFromCartById.mockReturnValue(mockCart);

      service.removeProductFromActiveCart('cart-001', 'prod-001');

      expect(
        mockProductRepository.releaseReservedStockForProduct,
      ).toHaveBeenCalledWith('prod-001', 3);
    });
  });

  describe('expireCartAndReleaseAllStockReservations', () => {
    it('should mark the cart as EXPIRED', () => {
      const cartWithItems: Cart = {
        ...mockCart,
        items: [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            unitPriceInPence: 1000,
            quantity: 2,
          },
        ],
      };

      mockCartRepository.findCartByIdOrThrow.mockReturnValue(cartWithItems);

      service.expireCartAndReleaseAllStockReservations('cart-001');

      expect(mockCartRepository.markCartStatusAsExpired).toHaveBeenCalledWith(
        'cart-001',
      );
    });

    it('should release reserved stock for each item in the cart', () => {
      const cartWithItems: Cart = {
        ...mockCart,
        items: [
          {
            productId: 'prod-001',
            productName: 'Product 1',
            unitPriceInPence: 1000,
            quantity: 2,
          },
          {
            productId: 'prod-002',
            productName: 'Product 2',
            unitPriceInPence: 2000,
            quantity: 3,
          },
        ],
      };

      mockCartRepository.findCartByIdOrThrow.mockReturnValue(cartWithItems);

      service.expireCartAndReleaseAllStockReservations('cart-001');

      expect(
        mockProductRepository.releaseReservedStockForProduct,
      ).toHaveBeenCalledWith('prod-001', 2);
      expect(
        mockProductRepository.releaseReservedStockForProduct,
      ).toHaveBeenCalledWith('prod-002', 3);
    });
  });
});
