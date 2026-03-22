import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/text';
import { CartItem } from '../../types/sharedTypes';
import { formatPenceAsPoundsSterling } from '../../utils/currencyFormatter';
import { ItemQuantitySelector } from './ItemQuantitySelector';

/**
 * A single row in the shopping cart; displays product details, quantity controls,
 * the line total, and a remove button.
 */
interface CartLineItemRowProps {
  item: CartItem;
  onQuantityChange: (newQuantity: number) => void;
  onRemoveItemFromCart: () => void;
}

export function CartLineItemRow({
  item,
  onQuantityChange,
  onRemoveItemFromCart,
}: CartLineItemRowProps) {
  const lineTotal = item.unitPriceInPence * item.quantity;

  return (
    <View className="py-4 border-b border-[#0f3460]">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-white font-medium text-sm">
            {item.productName}
          </Text>
          <Text className="text-[#94a3b8] text-xs mt-0.5">
            {formatPenceAsPoundsSterling(item.unitPriceInPence)} each
          </Text>
        </View>
        <Pressable onPress={onRemoveItemFromCart}>
          <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
        </Pressable>
      </View>
      <View className="flex-row items-center justify-between">
        <ItemQuantitySelector
          quantity={item.quantity}
          maximumQuantity={99}
          onIncrementQuantity={() => onQuantityChange(item.quantity + 1)}
          onDecrementQuantity={() => onQuantityChange(item.quantity - 1)}
        />
        <Text className="text-white font-bold text-base">
          {formatPenceAsPoundsSterling(lineTotal)}
        </Text>
      </View>
    </View>
  );
}
