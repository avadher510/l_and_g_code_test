import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Divider } from '../ui/divider';
import { SectionHeader } from '../common/SectionHeader';
import { OrderSummary } from '../../types/sharedTypes';
import { formatPenceAsPoundsSterling } from '../../utils/currencyFormatter';
import { OrderLineItemRow } from './OrderLineItemRow';
import { AppliedDiscountRow } from './AppliedDiscountRow';

/**
 * Renders a complete order summary after a successful checkout;
 * includes line items, applied discounts, and the final total.
 */
interface OrderSummaryDisplayProps {
  orderSummary: OrderSummary;
}

export function OrderSummaryDisplay({
  orderSummary,
}: OrderSummaryDisplayProps) {
  const orderIdShort = orderSummary.orderId.substring(0, 12) + '...';

  return (
    <View>
      <View className="bg-[#16213e] rounded-xl p-3 mb-4">
        <Text className="text-[#94a3b8] text-xs">Order reference</Text>
        <Text className="text-white font-mono text-sm mt-1">{orderIdShort}</Text>
      </View>

      <SectionHeader title="Items" />
      {orderSummary.lineItems.map((lineItem) => (
        <OrderLineItemRow key={lineItem.productId} lineItem={lineItem} />
      ))}

      <Divider className="my-3" />

      <View className="flex-row justify-between py-2">
        <Text className="text-[#94a3b8] text-sm">Subtotal</Text>
        <Text className="text-white text-sm font-semibold">
          {formatPenceAsPoundsSterling(orderSummary.subtotalInPence)}
        </Text>
      </View>

      {orderSummary.appliedDiscounts.length > 0 && (
        <>
          <SectionHeader title="Discounts Applied" />
          {orderSummary.appliedDiscounts.map((discount) => (
            <AppliedDiscountRow
              key={discount.discountId}
              appliedDiscount={discount}
            />
          ))}
          <View className="flex-row justify-between py-2">
            <Text className="text-emerald-400 text-sm font-medium">
              Total saved
            </Text>
            <Text className="text-emerald-400 text-sm font-medium">
              -{formatPenceAsPoundsSterling(orderSummary.totalDiscountAmountInPence)}
            </Text>
          </View>
        </>
      )}

      <Divider className="border-[#0f3460] border my-2" />

      <View className="flex-row justify-between py-3">
        <Text className="text-white font-bold text-lg">Total</Text>
        <Text className="text-[#e94560] font-bold text-xl">
          {formatPenceAsPoundsSterling(orderSummary.finalTotalInPence)}
        </Text>
      </View>
    </View>
  );
}
