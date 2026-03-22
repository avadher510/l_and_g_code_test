import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { Product } from '../../types/sharedTypes';
import { formatPenceAsPoundsSterling } from '../../utils/currencyFormatter';
import { StockAvailabilityBadge } from './StockAvailabilityBadge';

/**
 * A tappable card displaying a product summary; used in the product catalogue grid.
 * Shows the product name, price, category, and stock availability at a glance.
 */
interface ProductSummaryCardProps {
  product: Product;
  onPressViewProductDetails: (productId: string) => void;
}

export function ProductSummaryCard({
  product,
  onPressViewProductDetails,
}: ProductSummaryCardProps) {
  return (
    <Pressable
      className="flex-1 m-1.5"
      onPress={() => onPressViewProductDetails(product.id)}
    >
      <View className="bg-[#16213e] rounded-2xl p-4 border border-[#0f3460]">
        <View className="bg-[#0f3460] rounded-full px-2 py-0.5 self-start mb-2">
          <Text className="text-[#94a3b8] text-xs">{product.category}</Text>
        </View>
        <Text className="text-white font-semibold text-sm mt-1" numberOfLines={2}>
          {product.name}
        </Text>
        <Text className="text-[#e94560] font-bold text-lg mt-1">
          {formatPenceAsPoundsSterling(product.priceInPence)}
        </Text>
        <View className="flex-row justify-end mt-3">
          <StockAvailabilityBadge stockLevel={product.availableStock} />
        </View>
      </View>
    </Pressable>
  );
}
