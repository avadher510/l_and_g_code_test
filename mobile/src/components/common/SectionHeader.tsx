import React from 'react';
import { View } from 'react-native';
import { Heading } from '../ui/heading';
import { Text } from '../ui/text';

/**
 * A styled section heading with an optional subtitle;
 * used to introduce grouped content within a screen.
 */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View className="mb-3">
      <Heading className="text-white text-lg font-bold">{title}</Heading>
      {subtitle && (
        <Text className="text-[#94a3b8] text-sm mt-1">{subtitle}</Text>
      )}
    </View>
  );
}
