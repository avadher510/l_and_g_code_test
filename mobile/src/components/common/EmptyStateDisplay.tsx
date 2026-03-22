import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/text';
import { Heading } from '../ui/heading';
import { PrimaryActionButton } from './PrimaryActionButton';

/**
 * A centred empty state display; used when lists have no content to show.
 * Shows an icon, a heading, descriptive subtext, and an optional call to action.
 */
interface EmptyStateDisplayProps {
  iconName: keyof typeof Ionicons.glyphMap;
  heading: string;
  subtext: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export function EmptyStateDisplay({
  iconName,
  heading,
  subtext,
  ctaLabel,
  onCtaPress,
}: EmptyStateDisplayProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons name={iconName} size={64} color="#0f3460" />
      <Heading className="text-white text-xl font-bold mt-4 text-center">
        {heading}
      </Heading>
      <Text className="text-[#94a3b8] text-sm text-center mt-2">{subtext}</Text>
      {ctaLabel && onCtaPress && (
        <View className="mt-6 w-full">
          <PrimaryActionButton label={ctaLabel} onPress={onCtaPress} />
        </View>
      )}
    </View>
  );
}
