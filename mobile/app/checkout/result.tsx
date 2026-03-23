import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Text } from '../../src/components/ui/text';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { PrimaryActionButton } from '../../src/components/common/PrimaryActionButton';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { CheckoutStatusHeader } from '../../src/components/checkout/CheckoutStatusHeader';
import { OrderSummaryDisplay } from '../../src/components/checkout/OrderSummaryDisplay';
import { useSubmitCartForCheckout } from '../../src/hooks/useSubmitCartForCheckout';
import { useCartSessionStore } from '../../src/store/cartSessionStore';

export default function CheckoutResultScreen() {
  const router = useRouter();
  const { submitCartForCheckout, isProcessingCheckout, checkoutResult, hasCheckoutCompleted } = useSubmitCartForCheckout();
  const { clearCartSessionAfterSuccessfulCheckout } = useCartSessionStore();

  useEffect(() => {
    submitCartForCheckout();
  }, []);

  const handleContinueShopping = () => {
    clearCartSessionAfterSuccessfulCheckout();
    router.replace('/products');
  };

  if (!hasCheckoutCompleted) {
    return (
      <>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <CheckoutStatusHeader isLoading={isProcessingCheckout} isSuccess={false} />
      </>
    );
  }

  if (checkoutResult?.success) {
    return (
      <>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <ScreenContainer scrollable>
          <CheckoutStatusHeader isLoading={false} isSuccess={true} />
          
          {checkoutResult.orderSummary && (
            <OrderSummaryDisplay orderSummary={checkoutResult.orderSummary} />
          )}

          <View className="mt-6">
            <PrimaryActionButton
              label="Continue Shopping"
              onPress={handleContinueShopping}
            />
          </View>
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <ScreenContainer scrollable>
        <CheckoutStatusHeader isLoading={false} isSuccess={false} />

        <Text className="text-[#94a3b8] text-sm text-center mt-2 px-4">
          {checkoutResult?.failureReason ?? checkoutError?.message ?? 'An error occurred during checkout'}
        </Text>

        {checkoutResult?.insufficientStockItems && checkoutResult.insufficientStockItems.length > 0 && (
          <>
            <SectionHeader title="Items requiring attention:" />
            {checkoutResult.insufficientStockItems.map((item) => (
              <View
                key={item.productId}
                className="bg-[#16213e] rounded-xl p-3 mt-2 border border-red-500/20"
              >
                <Text className="text-white font-medium text-sm">
                  {item.productName}
                </Text>
                <Text className="text-red-400 text-xs mt-1">
                  Requested: {item.requestedQuantity} - Available: {item.availableQuantity}
                </Text>
              </View>
            ))}
          </>
        )}

        <View className="mt-6">
          <PrimaryActionButton
            label="Return to Basket"
            onPress={() => router.back()}
            variant="muted"
          />
        </View>
      </ScreenContainer>
    </>
  );
}
