import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { OrderLineItem } from '../../types/sharedTypes';
import { formatPenceAsPoundsSterling } from '../../utils/currencyFormatter';

/**
 * Displays a single line item within the order summary;
 * shows product name, quantity detail, and the line total.
 */
interface OrderLineItemRowProps {
  lineItem: OrderLineItem;
}

export function OrderLineItemRow({ lineItem }: OrderLineItemRowProps) {
  return (
    <View className="flex-row justify-between items-start py-2">
      <View className="flex-1 mr-2">
        <Text className="text-white text-sm font-medium">
          {lineItem.productName}
        </Text>
        <Text className="text-[#94a3b8] text-xs mt-0.5">
          {lineItem.quantity} × {formatPenceAsPoundsSterling(lineItem.unitPriceInPence)}
        </Text>
      </View>
      <Text className="text-white text-sm font-semibold">
        {formatPenceAsPoundsSterling(lineItem.lineTotalInPence)}
      </Text>
    </View>
  );
}
