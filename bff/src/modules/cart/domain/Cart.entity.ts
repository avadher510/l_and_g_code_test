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
  createdAt: Date;
  lastActivityAt: Date;
  status: CartStatus;
}
