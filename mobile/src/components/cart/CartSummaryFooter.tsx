import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { PrimaryActionButton } from '../common/PrimaryActionButton';
import { formatPenceAsPoundsSterling } from '../../utils/currencyFormatter';

/**
 * A sticky footer displayed at the bottom of the cart screen.
 * Shows the cart subtotal and the proceed-to-checkout action.
 */
interface CartSummaryFooterProps {
  subtotalInPence: number;
  totalItemCount: number;
  onProceedToCheckoutPress: () => void;
  isCartEmpty: boolean;
}

export function CartSummaryFooter({
  subtotalInPence,
  totalItemCount,
  onProceedToCheckoutPress,
  isCartEmpty,
}: CartSummaryFooterProps) {
  return (
    <View className="bg-[#16213e] border-t border-[#0f3460] px-4 pt-4 pb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-[#94a3b8] text-base">Subtotal</Text>
        <Text className="text-white font-bold text-lg">
          {formatPenceAsPoundsSterling(subtotalInPence)}
        </Text>
      </View>
      <PrimaryActionButton
        label="Proceed to Checkout"
        onPress={onProceedToCheckoutPress}
        isDisabled={isCartEmpty}
      />
    </View>
  );
}
