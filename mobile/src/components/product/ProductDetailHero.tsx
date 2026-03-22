import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/text';
import { Product } from '../../types/sharedTypes';
import { resolveIconNameForProductCategory } from '../../utils/categoryIconResolver';

/**
 * A large hero section displayed at the top of the product detail screen.
 * Shows a gradient background in brand colours with a category-appropriate icon;
 * acts as an attractive placeholder for product imagery.
 */
interface ProductDetailHeroProps {
  product: Product;
}

export function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const iconName = resolveIconNameForProductCategory(product.category);

  return (
    <View className="h-64 w-full bg-[#16213e] items-center justify-center relative overflow-hidden">
      <LinearGradient
        colors={['#0f3460', '#1a1a2e']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <Ionicons
        name={iconName as any}
        size={80}
        color="#e94560"
        style={{ opacity: 0.7 }}
      />
      <Text className="text-[#94a3b8] text-sm mt-2 uppercase tracking-widest">
        {product.category}
      </Text>
    </View>
  );
}
