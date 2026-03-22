import React, { useState, useEffect } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../src/components/ui/text';
import { Divider } from '../../src/components/ui/divider';
import { ScreenLoadingSpinner } from '../../src/components/common/ScreenLoadingSpinner';
import { InlineErrorMessage } from '../../src/components/common/InlineErrorMessage';
import { PrimaryActionButton } from '../../src/components/common/PrimaryActionButton';
import { ProductDetailHero } from '../../src/components/product/ProductDetailHero';
import { StockAvailabilityBadge } from '../../src/components/product/StockAvailabilityBadge';
import { ItemQuantitySelector } from '../../src/components/cart/ItemQuantitySelector';
import { useProductDetail } from '../../src/hooks/useProductDetail';
import { useAddItemToActiveCart } from '../../src/hooks/useAddItemToActiveCart';
import { formatPenceAsPoundsSterling } from '../../src/utils/currencyFormatter';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { product, isLoadingProduct, productLoadError } = useProductDetail(productId!);
  const { addItemToActiveCart, isAddingItemToCart, wasItemSuccessfullyAdded, resetAddItemState } = useAddItemToActiveCart();
  
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (wasItemSuccessfullyAdded) {
      setShowSuccessMessage(true);
      resetAddItemState();
      const timer = setTimeout(() => setShowSuccessMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [wasItemSuccessfullyAdded]);

  if (isLoadingProduct) {
    return <ScreenLoadingSpinner />;
  }

  if (productLoadError || !product) {
    return (
      <View className="flex-1 bg-[#1a1a2e]">
        <InlineErrorMessage message={productLoadError?.message ?? 'Product not found'} />
      </View>
    );
  }

  const maximumQuantity = Math.min(product.availableStock, 10);
  const isOutOfStock = product.availableStock === 0;

  const handleAddToBasket = async () => {
    try {
      await addItemToActiveCart({ productId: product.id, quantity: selectedQuantity });
    } catch (error) {
      // Error handled by the hook
    }
  };

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProductDetailHero product={product} />
        
        <Pressable
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-[#1a1a2e]/80 items-center justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>

        <View className="px-4 py-6">
          <View className="bg-[#0f3460] rounded-full px-2 py-0.5 self-start mb-2">
            <Text className="text-[#94a3b8] text-xs">{product.category}</Text>
          </View>

          <Text className="text-white text-2xl font-bold mt-2">{product.name}</Text>
          
          <Text className="text-[#e94560] text-3xl font-bold mt-1">
            {formatPenceAsPoundsSterling(product.priceInPence)}
          </Text>

          <View className="mt-2">
            <StockAvailabilityBadge stockLevel={product.availableStock} />
          </View>

          <Divider className="mt-4 mb-4" />

          <Text className="text-[#94a3b8] text-sm leading-6">{product.description}</Text>

          <Divider className="mt-4 mb-4" />

          <Text className="text-white font-semibold mb-3">Quantity</Text>
          
          <ItemQuantitySelector
            quantity={selectedQuantity}
            maximumQuantity={maximumQuantity}
            onIncrementQuantity={() => setSelectedQuantity(selectedQuantity + 1)}
            onDecrementQuantity={() => setSelectedQuantity(selectedQuantity - 1)}
          />

          <View className="mt-6">
            {showSuccessMessage && (
              <Text className="text-emerald-400 text-sm text-center mb-3">
                Added to basket! ✓
              </Text>
            )}
            <PrimaryActionButton
              label={isOutOfStock ? 'Out of Stock' : 'Add to Basket'}
              onPress={handleAddToBasket}
              isLoading={isAddingItemToCart}
              isDisabled={isOutOfStock}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
