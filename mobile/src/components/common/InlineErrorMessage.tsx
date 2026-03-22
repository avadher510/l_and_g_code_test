import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/text';
import { PrimaryActionButton } from './PrimaryActionButton';

/**
 * Displays an error message with an optional retry action.
 * Used when data fetching fails; shows the error reason clearly.
 */
interface InlineErrorMessageProps {
  message: string;
  onRetryPress?: () => void;
}

export function InlineErrorMessage({
  message,
  onRetryPress,
}: InlineErrorMessageProps) {
  return (
    <View className="items-center justify-center px-4">
      <Ionicons name="alert-circle-outline" size={48} color="#f87171" />
      <Text className="text-red-400 text-sm text-center mt-2">{message}</Text>
      {onRetryPress && (
        <View className="mt-4 w-full">
          <PrimaryActionButton
            label="Try Again"
            onPress={onRetryPress}
            variant="danger"
          />
        </View>
      )}
    </View>
  );
}
