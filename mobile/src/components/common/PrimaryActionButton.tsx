import React from 'react';
import { Pressable, View } from 'react-native';
import { Spinner } from '../ui/spinner';
import { Text } from '../ui/text';

/**
 * The primary call-to-action button used throughout the app.
 * Supports loading and disabled states; full-width by default.
 */
interface PrimaryActionButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  loadingLabel?: string;
  variant?: 'accent' | 'danger' | 'muted';
  testID?: string;
}

export function PrimaryActionButton({
  label,
  onPress,
  isLoading = false,
  isDisabled = false,
  loadingLabel = 'Processing...',
  variant = 'accent',
  testID,
}: PrimaryActionButtonProps) {
  const variantClasses = {
    accent: 'bg-[#e94560]',
    danger: 'bg-red-600',
    muted: 'bg-[#0f3460]',
  };

  const baseClasses = 'rounded-xl py-4 px-6 items-center justify-center w-full';
  const disabledClasses = isDisabled || isLoading ? 'opacity-40' : '';

  return (
    <Pressable
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
      onPress={onPress}
      disabled={isDisabled || isLoading}
      testID={testID}
    >
      <View className="flex-row items-center justify-center">
        {isLoading && <Spinner size="small" color="#ffffff" />}
        <Text className="text-white font-semibold text-base ml-2">
          {isLoading ? loadingLabel : label}
        </Text>
      </View>
    </Pressable>
  );
}
