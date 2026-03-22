/** Represents the display availability status of a product. */
export type StockAvailabilityStatus = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';

/** The stock quantity at or below which a product is considered low stock. */
const LOW_STOCK_THRESHOLD = 5;

/**
 * Classifies a numeric stock level into one of three availability statuses;
 * used to drive badge colour and label throughout the product catalogue.
 *
 * @param stockLevel - The current available stock quantity
 * @returns A StockAvailabilityStatus value
 */
export function classifyStockLevelAsAvailabilityStatus(
  stockLevel: number,
): StockAvailabilityStatus {
  if (stockLevel === 0) return 'OUT_OF_STOCK';
  if (stockLevel <= LOW_STOCK_THRESHOLD) return 'LOW_STOCK';
  return 'IN_STOCK';
}
