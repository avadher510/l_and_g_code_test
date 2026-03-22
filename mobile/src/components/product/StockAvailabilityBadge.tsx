import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { classifyStockLevelAsAvailabilityStatus } from '../../utils/stockLevelClassifier';

/**
 * Displays a coloured pill badge indicating the availability of a product.
 * Colour and label change based on the stock level classification.
 *
 * @param stockLevel - The current available stock quantity for the product
 */
interface StockAvailabilityBadgeProps {
  stockLevel: number;
}

export function StockAvailabilityBadge({
  stockLevel,
}: StockAvailabilityBadgeProps) {
  const status = classifyStockLevelAsAvailabilityStatus(stockLevel);

  const config = {
    OUT_OF_STOCK: {
      containerClass: 'bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1',
      textClass: 'text-red-400 text-xs font-medium',
      label: 'Out of Stock',
    },
    LOW_STOCK: {
      containerClass: 'bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1',
      textClass: 'text-amber-400 text-xs font-medium',
      label: `Low Stock - ${stockLevel} left`,
    },
    IN_STOCK: {
      containerClass: 'bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1',
      textClass: 'text-emerald-400 text-xs font-medium',
      label: 'In Stock',
    },
  };

  const { containerClass, textClass, label } = config[status];

  return (
    <View className={containerClass}>
      <Text className={textClass}>{label}</Text>
    </View>
  );
}
