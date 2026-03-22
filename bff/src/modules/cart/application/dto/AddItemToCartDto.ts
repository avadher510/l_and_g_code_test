import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import {
  MINIMUM_CART_ITEM_QUANTITY,
  MAXIMUM_CART_ITEM_QUANTITY,
} from '../../../../shared/constants/businessRules';

export class AddItemToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(MINIMUM_CART_ITEM_QUANTITY)
  @Max(MAXIMUM_CART_ITEM_QUANTITY)
  quantity: number;
}
