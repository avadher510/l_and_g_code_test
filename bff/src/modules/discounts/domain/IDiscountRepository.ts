import { Discount } from './Discount.entity';

export const DISCOUNT_REPOSITORY_TOKEN = 'IDiscountRepository';

export interface IDiscountRepository {
  findAllActiveDiscounts(): Discount[];
  findDiscountById(discountId: string): Discount | undefined;
}
