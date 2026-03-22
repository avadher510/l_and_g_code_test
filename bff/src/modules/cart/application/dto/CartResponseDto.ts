import { CartItem, CartStatus } from '../../domain/Cart.entity';

export class CartResponseDto {
  id: string;
  items: CartItem[];
  totalItemCount: number;
  subtotalInPence: number;
  status: CartStatus;
  createdAt: Date;
  lastActivityAt: Date;
}
