import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from '../application/CheckoutService';
import { CartService } from '../../cart/application/CartService';
import { ProductsService } from '../../products/application/ProductsService';
import { DiscountEngine } from '../../discounts/application/DiscountEngine';
import type { IDiscountRepository } from '../../discounts/domain/IDiscountRepository';
import { DISCOUNT_REPOSITORY_TOKEN } from '../../discounts/domain/IDiscountRepository';
import { CartStatus } from '../../cart/domain/Cart.entity';
import { Discount, DiscountType } from '../../discounts/domain/Discount.entity';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let mockCartService: jest.Mocked<CartService>;
  let mockProductsService: jest.Mocked<ProductsService>;
  let mockDiscountEngine: jest.Mocked<DiscountEngine>;
  let mockDiscountRepository: jest.Mocked<IDiscountRepository>;

  const mockCartResponse = {
    id: 'cart-001',
    items: [
      {
        productId: 'prod-001',
        productName: 'Test Product',
        unitPriceInPence: 1000,
        quantity: 2,
      },
    ],
    totalItemCount: 2,
    subtotalInPence: 2000,
    status: CartStatus.ACTIVE,
    createdAt: new Date(),
    lastActivityAt: new Date(),
  };

  const mockDiscounts: Discount[] = [
    {
      id: 'disc-001',
      name: 'Test Discount',
      type: DiscountType.PERCENTAGE_OFF_ORDER,
      value: 10,
      isActive: true,
      description: 'Test',
      conditions: { minimumOrderValueInPence: 1000 },
    },
  ];

  beforeEach(async () => {
    mockCartService = {
      retrieveActiveCartByIdOrThrow: jest.fn(),
      expireCartAndReleaseAllStockReservations: jest.fn(),
    } as unknown as jest.Mocked<CartService>;

    mockProductsService = {
      validateSufficientStockForAllCartItems: jest.fn(),
      releaseStockReservationForAllCartItems: jest.fn(),
      deductStockForAllPurchasedItems: jest.fn(),
    } as unknown as jest.Mocked<ProductsService>;

    mockDiscountEngine = {
      calculateCartSubtotalInPence: jest.fn(),
      calculateAllApplicableDiscountsForCart: jest.fn(),
    } as unknown as jest.Mocked<DiscountEngine>;

    mockDiscountRepository = {
      findAllActiveDiscounts: jest.fn(),
      findDiscountById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        {
          provide: CartService,
          useValue: mockCartService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: DiscountEngine,
          useValue: mockDiscountEngine,
        },
        {
          provide: DISCOUNT_REPOSITORY_TOKEN,
          useValue: mockDiscountRepository,
        },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
  });

  describe('processCartCheckoutById', () => {
    it('should successfully checkout when stock is available', () => {
      mockCartService.retrieveActiveCartByIdOrThrow.mockReturnValue(
        mockCartResponse,
      );
      mockProductsService.validateSufficientStockForAllCartItems.mockReturnValue(
        [],
      );
      mockDiscountEngine.calculateCartSubtotalInPence.mockReturnValue(2000);
      mockDiscountRepository.findAllActiveDiscounts.mockReturnValue(
        mockDiscounts,
      );
      mockDiscountEngine.calculateAllApplicableDiscountsForCart.mockReturnValue(
        [
          {
            discountId: 'disc-001',
            discountName: 'Test Discount',
            discountType: DiscountType.PERCENTAGE_OFF_ORDER,
            savingInPence: 200,
          },
        ],
      );

      const result = service.processCartCheckoutById('cart-001');

      expect(result.success).toBe(true);
      expect(result.orderId).toBeDefined();
      expect(result.orderSummary).toBeDefined();
      expect(result.orderSummary?.subtotalInPence).toBe(2000);
      expect(result.orderSummary?.totalDiscountAmountInPence).toBe(200);
      expect(result.orderSummary?.finalTotalInPence).toBe(1800);
      expect(mockProductsService.deductStockForAllPurchasedItems).toHaveBeenCalled();
    });

    it('should fail checkout when stock is insufficient', () => {
      mockCartService.retrieveActiveCartByIdOrThrow.mockReturnValue(
        mockCartResponse,
      );
      mockProductsService.validateSufficientStockForAllCartItems.mockReturnValue(
        [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            requestedQuantity: 2,
            availableQuantity: 1,
          },
        ],
      );

      const result = service.processCartCheckoutById('cart-001');

      expect(result.success).toBe(false);
      expect(result.failureReason).toBeDefined();
      expect(result.insufficientStockItems).toHaveLength(1);
      expect(
        mockProductsService.releaseStockReservationForAllCartItems,
      ).toHaveBeenCalled();
      expect(
        mockCartService.expireCartAndReleaseAllStockReservations,
      ).toHaveBeenCalledWith('cart-001');
    });

    it('should generate a unique order ID with ORD- prefix', () => {
      mockCartService.retrieveActiveCartByIdOrThrow.mockReturnValue(
        mockCartResponse,
      );
      mockProductsService.validateSufficientStockForAllCartItems.mockReturnValue(
        [],
      );
      mockDiscountEngine.calculateCartSubtotalInPence.mockReturnValue(2000);
      mockDiscountRepository.findAllActiveDiscounts.mockReturnValue([]);
      mockDiscountEngine.calculateAllApplicableDiscountsForCart.mockReturnValue(
        [],
      );

      const result = service.processCartCheckoutById('cart-001');

      expect(result.orderId).toMatch(/^ORD-[A-F0-9]{8}$/);
    });

    it('should apply multiple discounts correctly', () => {
      mockCartService.retrieveActiveCartByIdOrThrow.mockReturnValue(
        mockCartResponse,
      );
      mockProductsService.validateSufficientStockForAllCartItems.mockReturnValue(
        [],
      );
      mockDiscountEngine.calculateCartSubtotalInPence.mockReturnValue(2000);
      mockDiscountRepository.findAllActiveDiscounts.mockReturnValue(
        mockDiscounts,
      );
      mockDiscountEngine.calculateAllApplicableDiscountsForCart.mockReturnValue(
        [
          {
            discountId: 'disc-001',
            discountName: 'Discount 1',
            discountType: DiscountType.PERCENTAGE_OFF_ORDER,
            savingInPence: 200,
          },
          {
            discountId: 'disc-002',
            discountName: 'Discount 2',
            discountType: DiscountType.FIXED_AMOUNT_OFF_ORDER,
            savingInPence: 500,
          },
        ],
      );

      const result = service.processCartCheckoutById('cart-001');

      expect(result.success).toBe(true);
      expect(result.orderSummary?.appliedDiscounts).toHaveLength(2);
      expect(result.orderSummary?.totalDiscountAmountInPence).toBe(700);
      expect(result.orderSummary?.finalTotalInPence).toBe(1300);
    });

    it('should ensure final total never goes below zero', () => {
      mockCartService.retrieveActiveCartByIdOrThrow.mockReturnValue(
        mockCartResponse,
      );
      mockProductsService.validateSufficientStockForAllCartItems.mockReturnValue(
        [],
      );
      mockDiscountEngine.calculateCartSubtotalInPence.mockReturnValue(1000);
      mockDiscountRepository.findAllActiveDiscounts.mockReturnValue(
        mockDiscounts,
      );
      mockDiscountEngine.calculateAllApplicableDiscountsForCart.mockReturnValue(
        [
          {
            discountId: 'disc-001',
            discountName: 'Huge Discount',
            discountType: DiscountType.FIXED_AMOUNT_OFF_ORDER,
            savingInPence: 2000,
          },
        ],
      );

      const result = service.processCartCheckoutById('cart-001');

      expect(result.success).toBe(true);
      expect(result.orderSummary?.finalTotalInPence).toBe(0);
    });
  });
});
