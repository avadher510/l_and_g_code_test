import { AppliedDiscount } from '../../../discounts/domain/Discount.entity';

export interface InsufficientStockDetail {
  productId: string;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
}

export interface OrderLineItem {
  productId: string;
  productName: string;
  unitPriceInPence: number;
  quantity: number;
  lineTotalInPence: number;
}

export interface OrderSummary {
  orderId: string;
  lineItems: OrderLineItem[];
  subtotalInPence: number;
  appliedDiscounts: AppliedDiscount[];
  totalDiscountAmountInPence: number;
  finalTotalInPence: number;
  checkedOutAt: Date;
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  orderSummary?: OrderSummary;
  failureReason?: string;
  insufficientStockItems?: InsufficientStockDetail[];
}
