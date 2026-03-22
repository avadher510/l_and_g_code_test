import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';

/**
 * An inline quantity selector with increment and decrement controls.
 * Enforces minimum (1) and maximum quantity boundaries.
 */
interface ItemQuantitySelectorProps {
  quantity: number;
  maximumQuantity: number;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
  testID?: string;
}

export function ItemQuantitySelector({
  quantity,
  maximumQuantity,
  onIncrementQuantity,
  onDecrementQuantity,
  testID,
}: ItemQuantitySelectorProps) {
  const isMinusDisabled = quantity === 1;
  const isPlusDisabled = quantity === maximumQuantity;

  return (
    <View className="flex-row items-center" testID={testID}>
      <Pressable
        className="w-8 h-8 rounded-full border border-[#0f3460] items-center justify-center"
        onPress={onDecrementQuantity}
        disabled={isMinusDisabled}
        style={{ opacity: isMinusDisabled ? 0.3 : 1 }}
      >
        <Text className="text-white font-bold">−</Text>
      </Pressable>
      <Text className="text-white font-semibold text-base mx-3 min-w-[20px] text-center">
        {quantity}
      </Text>
      <Pressable
        className="w-8 h-8 rounded-full border border-[#0f3460] items-center justify-center"
        onPress={onIncrementQuantity}
        disabled={isPlusDisabled}
        style={{ opacity: isPlusDisabled ? 0.3 : 1 }}
      >
        <Text className="text-white font-bold">+</Text>
      </Pressable>
    </View>
  );
}
