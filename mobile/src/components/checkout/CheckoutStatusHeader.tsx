import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Heading } from '../ui/heading';
import { ScreenLoadingSpinner } from '../common/ScreenLoadingSpinner';

/**
 * Displays the visual status of a checkout attempt.
 * Shows a loading state, a success state, or a failure state
 * depending on the current checkout progress.
 */
interface CheckoutStatusHeaderProps {
  isLoading: boolean;
  isSuccess: boolean;
}

export function CheckoutStatusHeader({
  isLoading,
  isSuccess,
}: CheckoutStatusHeaderProps) {
  if (isLoading) {
    return <ScreenLoadingSpinner message="Processing your order..." />;
  }

  if (isSuccess) {
    return (
      <View className="items-center py-8">
        <Ionicons name="checkmark-circle" size={80} color="#10b981" />
        <Heading className="text-white text-2xl font-bold text-center mt-4">
          Order Confirmed!
        </Heading>
      </View>
    );
  }

  return (
    <View className="items-center py-8">
      <Ionicons name="close-circle" size={80} color="#ef4444" />
      <Heading className="text-white text-2xl font-bold text-center mt-4">
        Checkout Failed
      </Heading>
    </View>
  );
}
