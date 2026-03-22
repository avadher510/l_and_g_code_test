import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { AppliedDiscount } from '../../types/sharedTypes';
import { formatPenceAsPoundsSterling } from '../../utils/currencyFormatter';

/**
 * Displays a single applied discount within the order summary;
 * shows the discount name and the amount saved in emerald green.
 */
interface AppliedDiscountRowProps {
  appliedDiscount: AppliedDiscount;
}

export function AppliedDiscountRow({
  appliedDiscount,
}: AppliedDiscountRowProps) {
  return (
    <View className="flex-row justify-between items-center py-1">
      <Text className="text-[#94a3b8] text-sm flex-1 mr-2">
        {appliedDiscount.discountName}
      </Text>
      <Text className="text-emerald-400 text-sm font-medium">
        -{formatPenceAsPoundsSterling(appliedDiscount.savingInPence)}
      </Text>
    </View>
  );
}
