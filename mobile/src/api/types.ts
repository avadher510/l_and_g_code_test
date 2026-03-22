export interface Product {
  id: string;
  name: string;
  description: string;
  priceInPence: number;
  category: string;
  availableStock: number;
  totalStock: number;
  imageUrl: string;
}

export interface Discount {
  id: string;
  name: string;
  type: string;
  value: number;
  isActive: boolean;
  description: string;
  conditions: {
    minimumOrderValueInPence?: number;
    applicableProductId?: string;
    buyQuantity?: number;
    getQuantity?: number;
  };
}

export interface CartItem {
  productId: string;
  productName: string;
  unitPriceInPence: number;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItemCount: number;
  subtotalInPence: number;
  status: string;
  createdAt: string;
  lastActivityAt: string;
}

export interface AppliedDiscount {
  discountId: string;
  discountName: string;
  discountType: string;
  savingInPence: number;
}

export interface OrderSummary {
  orderId: string;
  lineItems: Array<{
    productId: string;
    productName: string;
    unitPriceInPence: number;
    quantity: number;
    lineTotalInPence: number;
  }>;
  subtotalInPence: number;
  appliedDiscounts: AppliedDiscount[];
  totalDiscountAmountInPence: number;
  finalTotalInPence: number;
  checkedOutAt: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  orderSummary?: OrderSummary;
  failureReason?: string;
  insufficientStockItems?: Array<{
    productId: string;
    productName: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
