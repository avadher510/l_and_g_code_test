import { Discount, DiscountType } from '../domain/Discount.entity';

export const seedDiscounts: Discount[] = [
  {
    id: 'disc-001',
    name: 'Summer Sale',
    type: DiscountType.PERCENTAGE_OFF_ORDER,
    value: 10,
    isActive: true,
    description:
      '10% off your order; applies automatically when you spend £30 or more.',
    conditions: {
      minimumOrderValueInPence: 3000,
    },
  },
  {
    id: 'disc-002',
    name: 'Buy 2 Get 1 Free on Coffee',
    type: DiscountType.BUY_X_GET_Y_FREE,
    value: 1,
    isActive: true,
    description:
      'Buy any two bags of Organic Arabica Coffee Beans and receive one free; applied automatically at checkout.',
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
    description:
      '£5 off your order; applies automatically when you spend £50 or more.',
    conditions: {
      minimumOrderValueInPence: 5000,
    },
  },
];
