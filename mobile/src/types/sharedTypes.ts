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
  availableStock: number;
  totalStock: number;
  imageUrl: string;
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
}

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT',
  EXPIRED = 'EXPIRED',
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
  status: CartStatus;
  createdAt: string;
  lastActivityAt: string;
}

export enum DiscountType {
  PERCENTAGE_OFF_ORDER = 'PERCENTAGE_OFF_ORDER',
  BUY_X_GET_Y_FREE = 'BUY_X_GET_Y_FREE',
  FIXED_AMOUNT_OFF_ORDER = 'FIXED_AMOUNT_OFF_ORDER',
}

export interface AppliedDiscount {
  discountId: string;
  discountName: string;
  discountType: DiscountType;
  savingInPence: number;
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
  checkedOutAt: string;
}

export interface InsufficientStockDetail {
  productId: string;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  orderSummary?: OrderSummary;
  failureReason?: string;
  insufficientStockItems?: InsufficientStockDetail[];
}

export interface BffSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface BffErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
