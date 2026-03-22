import React from 'react';
import { View } from 'react-native';
import { Spinner } from '../ui/spinner';
import { Text } from '../ui/text';

/**
 * A full-screen centred loading indicator; displayed during data fetching.
 * Accepts an optional message to display below the spinner.
 */
interface ScreenLoadingSpinnerProps {
  message?: string;
}

export function ScreenLoadingSpinner({ message }: ScreenLoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center bg-[#1a1a2e]">
      <Spinner size="large" color="#ffffff" />
      {message && <Text className="text-[#94a3b8] text-sm mt-3">{message}</Text>}
    </View>
  );
}
