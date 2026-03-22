import React, { useEffect } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../src/components/ui/text';
import { ScreenContainer } from '../../src/components/common/ScreenContainer';
import { ScreenLoadingSpinner } from '../../src/components/common/ScreenLoadingSpinner';
import { InlineErrorMessage } from '../../src/components/common/InlineErrorMessage';
import { EmptyStateDisplay } from '../../src/components/common/EmptyStateDisplay';
import { ProductSummaryCard } from '../../src/components/product/ProductSummaryCard';
import { useProductCatalogue } from '../../src/hooks/useProductCatalogue';
import { useActiveCartContents } from '../../src/hooks/useActiveCartContents';
import { useCartSessionStore } from '../../src/store/cartSessionStore';

export default function ProductListScreen() {
  const router = useRouter();
  const { initiateNewShoppingCartIfNoneExists } = useCartSessionStore();
  const { products, isLoadingProducts, productsLoadError, refetchProductCatalogue } = useProductCatalogue();
  const { cart } = useActiveCartContents();

  useEffect(() => {
    initiateNewShoppingCartIfNoneExists();
  }, []);

  if (isLoadingProducts) {
    return <ScreenLoadingSpinner />;
  }

  if (productsLoadError) {
    return (
      <ScreenContainer>
        <InlineErrorMessage
          message={productsLoadError.message}
          onRetryPress={refetchProductCatalogue}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-2xl font-bold">🛍 Shop</Text>
        <Pressable
          className="relative"
          onPress={() => router.push('/cart')}
        >
          <Ionicons name="cart-outline" size={28} color="#ffffff" />
          {cart && cart.totalItemCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {cart.totalItemCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductSummaryCard
            product={item}
            onPressViewProductDetails={(productId) =>
              router.push(`/products/${productId}`)
            }
          />
        )}
        keyExtractor={(item) => item.id}
        refreshing={isLoadingProducts}
        onRefresh={refetchProductCatalogue}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          !isLoadingProducts ? (
            <EmptyStateDisplay
              iconName="cube-outline"
              heading="No products available"
              subtext="Check back later for new items"
            />
          ) : null
        }
      />
    </ScreenContainer>
  );
}
