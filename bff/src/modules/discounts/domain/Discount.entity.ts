export enum DiscountType {
  PERCENTAGE_OFF_ORDER = 'PERCENTAGE_OFF_ORDER',
  BUY_X_GET_Y_FREE = 'BUY_X_GET_Y_FREE',
  FIXED_AMOUNT_OFF_ORDER = 'FIXED_AMOUNT_OFF_ORDER',
}

export interface DiscountConditions {
  minimumOrderValueInPence?: number;
  applicableProductId?: string;
  buyQuantity?: number;
  getQuantity?: number;
}

export interface Discount {
  id: string;
  name: string;
  description: string;
  type: DiscountType;
  isActive: boolean;
  value: number;
  conditions: DiscountConditions;
}

export interface AppliedDiscount {
  discountId: string;
  discountName: string;
  discountType: DiscountType;
  savingInPence: number;
}
