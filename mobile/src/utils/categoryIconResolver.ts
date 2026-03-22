import { ProductCategory } from '../types/sharedTypes';

/**
 * Maps a ProductCategory enum value to an appropriate icon name
 * from the @expo/vector-icons Ionicons set; used in product hero displays.
 *
 * @param category - The product category to resolve an icon for
 * @returns An Ionicons icon name string
 */
export function resolveIconNameForProductCategory(
  category: ProductCategory,
): string {
  const categoryIconMap: Record<ProductCategory, string> = {
    [ProductCategory.ELECTRONICS]: 'headset-outline',
    [ProductCategory.CLOTHING]: 'shirt-outline',
    [ProductCategory.FOOD]: 'cafe-outline',
    [ProductCategory.HOME]: 'home-outline',
    [ProductCategory.SPORTS]: 'bicycle-outline',
  };
  return categoryIconMap[category] ?? 'cube-outline';
}
