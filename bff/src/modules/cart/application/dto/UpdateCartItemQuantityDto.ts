import { IsInt, Min, Max } from 'class-validator';
import {
  MINIMUM_CART_ITEM_QUANTITY,
  MAXIMUM_CART_ITEM_QUANTITY,
} from '../../../../shared/constants/businessRules';

export class UpdateCartItemQuantityDto {
  @IsInt()
  @Min(MINIMUM_CART_ITEM_QUANTITY)
  @Max(MAXIMUM_CART_ITEM_QUANTITY)
  quantity: number;
}
