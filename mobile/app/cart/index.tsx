import React from 'react';
import { View, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Text } from '../../src/components/ui/text';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { ScreenLoadingSpinner } from '../../src/components/common/ScreenLoadingSpinner';
import { InlineErrorMessage } from '../../src/components/common/InlineErrorMessage';
import { EmptyStateDisplay } from '../../src/components/common/EmptyStateDisplay';
import { CartLineItemRow } from '../../src/components/cart/CartLineItemRow';
import { CartSummaryFooter } from '../../src/components/cart/CartSummaryFooter';
import { useActiveCartContents } from '../../src/hooks/useActiveCartContents';
import { useUpdateCartItemQuantity } from '../../src/hooks/useUpdateCartItemQuantity';
import { useRemoveItemFromActiveCart } from '../../src/hooks/useRemoveItemFromActiveCart';

export default function CartScreen() {
  const router = useRouter();
  const { cart, isLoadingCart, cartLoadError, refetchCart } = useActiveCartContents();
  const { updateItemQuantityInActiveCart } = useUpdateCartItemQuantity();
  const { removeItemFromActiveCart } = useRemoveItemFromActiveCart();

  useFocusEffect(
    React.useCallback(() => {
      refetchCart();
    }, [refetchCart])
  );

  if (isLoadingCart) {
    return <ScreenLoadingSpinner message="Loading your basket..." />;
  }

  if (cartLoadError) {
    return (
      <ScreenContainer>
        <InlineErrorMessage message={cartLoadError.message} />
      </ScreenContainer>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <ScreenContainer>
        <EmptyStateDisplay
          iconName="cart-outline"
          heading="Your basket is empty"
          subtext="Add some products to get started"
          ctaLabel="Start Shopping"
          onCtaPress={() => router.push('/products')}
        />
      </ScreenContainer>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-4">
        <Text className="text-white text-xl font-bold">
          Your Basket{' '}
          <Text className="text-[#94a3b8]">({cart.totalItemCount} items)</Text>
        </Text>
      </View>

      <FlatList
        data={cart.items}
        renderItem={({ item }) => (
          <View className="px-4">
            <CartLineItemRow
              item={item}
              onQuantityChange={(newQuantity) =>
                updateItemQuantityInActiveCart({
                  productId: item.productId,
                  quantity: newQuantity,
                })
              }
              onRemoveItemFromCart={() =>
                removeItemFromActiveCart({ productId: item.productId })
              }
            />
          </View>
        )}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={{ paddingBottom: 200 }}
      />

      <View className="absolute bottom-0 left-0 right-0">
        <CartSummaryFooter
          subtotalInPence={cart.subtotalInPence}
          totalItemCount={cart.totalItemCount}
          onProceedToCheckoutPress={() => router.push('/checkout/result')}
          isCartEmpty={cart.items.length === 0}
        />
      </View>
    </View>
  );
}
