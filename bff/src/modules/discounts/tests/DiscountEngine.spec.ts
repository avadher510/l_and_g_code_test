import { Test, TestingModule } from '@nestjs/testing';
import { DiscountEngine } from '../application/DiscountEngine';
import { Discount, DiscountType } from '../domain/Discount.entity';
import type { Cart, CartItem } from '../application/DiscountEngine';

describe('DiscountEngine', () => {
  let engine: DiscountEngine;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountEngine],
    }).compile();

    engine = module.get<DiscountEngine>(DiscountEngine);
  });

  const createMockCart = (items: CartItem[]): Cart => ({
    id: 'cart-001',
    items,
    createdAt: new Date(),
    lastActivityAt: new Date(),
    status: 'ACTIVE',
  });

  describe('calculateAllApplicableDiscountsForCart', () => {
    it('should return empty array when cart subtotal is below all discount thresholds', () => {
      const cart = createMockCart([
        {
          productId: 'prod-001',
          productName: 'Test Product',
          unitPriceInPence: 1000,
          quantity: 1,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-001',
          name: 'Summer Sale',
          type: DiscountType.PERCENTAGE_OFF_ORDER,
          value: 10,
          isActive: true,
          description: '10% off',
          conditions: { minimumOrderValueInPence: 3000 },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toEqual([]);
    });

    it('should apply PERCENTAGE_OFF_ORDER when order meets minimum value', () => {
      const cart = createMockCart([
        {
          productId: 'prod-001',
          productName: 'Test Product',
          unitPriceInPence: 3000,
          quantity: 1,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-001',
          name: 'Summer Sale',
          type: DiscountType.PERCENTAGE_OFF_ORDER,
          value: 10,
          isActive: true,
          description: '10% off',
          conditions: { minimumOrderValueInPence: 3000 },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toHaveLength(1);
      expect(result[0].discountName).toBe('Summer Sale');
      expect(result[0].savingInPence).toBe(300);
    });

    it('should NOT apply PERCENTAGE_OFF_ORDER when order is below minimum value', () => {
      const cart = createMockCart([
        {
          productId: 'prod-001',
          productName: 'Test Product',
          unitPriceInPence: 2999,
          quantity: 1,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-001',
          name: 'Summer Sale',
          type: DiscountType.PERCENTAGE_OFF_ORDER,
          value: 10,
          isActive: true,
          description: '10% off',
          conditions: { minimumOrderValueInPence: 3000 },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toEqual([]);
    });

    it('should correctly calculate free items for BUY_X_GET_Y_FREE (buying 4; getting 1 free)', () => {
      const cart = createMockCart([
        {
          productId: 'prod-004',
          productName: 'Coffee',
          unitPriceInPence: 1299,
          quantity: 4,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-002',
          name: 'Buy 2 Get 1 Free',
          type: DiscountType.BUY_X_GET_Y_FREE,
          value: 1,
          isActive: true,
          description: 'Buy 2 Get 1 Free',
          conditions: {
            applicableProductId: 'prod-004',
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toHaveLength(1);
      expect(result[0].savingInPence).toBe(1299);
    });

    it('should return zero saving when the applicable product is not in the cart', () => {
      const cart = createMockCart([
        {
          productId: 'prod-001',
          productName: 'Other Product',
          unitPriceInPence: 1000,
          quantity: 3,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-002',
          name: 'Buy 2 Get 1 Free',
          type: DiscountType.BUY_X_GET_Y_FREE,
          value: 1,
          isActive: true,
          description: 'Buy 2 Get 1 Free',
          conditions: {
            applicableProductId: 'prod-004',
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toEqual([]);
    });

    it('should return zero saving when quantity is below the buyQuantity threshold', () => {
      const cart = createMockCart([
        {
          productId: 'prod-004',
          productName: 'Coffee',
          unitPriceInPence: 1299,
          quantity: 1,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-002',
          name: 'Buy 2 Get 1 Free',
          type: DiscountType.BUY_X_GET_Y_FREE,
          value: 1,
          isActive: true,
          description: 'Buy 2 Get 1 Free',
          conditions: {
            applicableProductId: 'prod-004',
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toEqual([]);
    });

    it('should apply FIXED_AMOUNT_OFF_ORDER when subtotal meets the minimum', () => {
      const cart = createMockCart([
        {
          productId: 'prod-001',
          productName: 'Test Product',
          unitPriceInPence: 5000,
          quantity: 1,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-003',
          name: 'Welcome Discount',
          type: DiscountType.FIXED_AMOUNT_OFF_ORDER,
          value: 500,
          isActive: true,
          description: '£5 off',
          conditions: { minimumOrderValueInPence: 5000 },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toHaveLength(1);
      expect(result[0].savingInPence).toBe(500);
    });

    it('should NOT apply FIXED_AMOUNT_OFF_ORDER when subtotal is below the minimum', () => {
      const cart = createMockCart([
        {
          productId: 'prod-001',
          productName: 'Test Product',
          unitPriceInPence: 4999,
          quantity: 1,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-003',
          name: 'Welcome Discount',
          type: DiscountType.FIXED_AMOUNT_OFF_ORDER,
          value: 500,
          isActive: true,
          description: '£5 off',
          conditions: { minimumOrderValueInPence: 5000 },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toEqual([]);
    });

    it('should return all applicable discounts when multiple qualify; stacking correctly', () => {
      const cart = createMockCart([
        {
          productId: 'prod-004',
          productName: 'Coffee',
          unitPriceInPence: 1299,
          quantity: 3,
        },
        {
          productId: 'prod-001',
          productName: 'Expensive Item',
          unitPriceInPence: 4000,
          quantity: 1,
        },
      ]);

      const discounts: Discount[] = [
        {
          id: 'disc-001',
          name: 'Summer Sale',
          type: DiscountType.PERCENTAGE_OFF_ORDER,
          value: 10,
          isActive: true,
          description: '10% off',
          conditions: { minimumOrderValueInPence: 3000 },
        },
        {
          id: 'disc-002',
          name: 'Buy 2 Get 1 Free',
          type: DiscountType.BUY_X_GET_Y_FREE,
          value: 1,
          isActive: true,
          description: 'Buy 2 Get 1 Free',
          conditions: {
            applicableProductId: 'prod-004',
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
        {
          id: 'disc-003',
          name: 'Welcome Discount',
          type: DiscountType.FIXED_AMOUNT_OFF_ORDER,
          value: 500,
          isActive: true,
          description: '£5 off',
          conditions: { minimumOrderValueInPence: 5000 },
        },
      ];

      const result = engine.calculateAllApplicableDiscountsForCart(
        cart,
        discounts,
      );

      expect(result).toHaveLength(3);
      expect(result.map((d) => d.discountName)).toContain('Summer Sale');
      expect(result.map((d) => d.discountName)).toContain('Buy 2 Get 1 Free');
      expect(result.map((d) => d.discountName)).toContain('Welcome Discount');
    });
  });
});
