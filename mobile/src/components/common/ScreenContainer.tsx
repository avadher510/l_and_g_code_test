import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * A full-screen wrapper providing safe area insets and consistent
 * background colour. Accepts an optional scrollable prop to wrap
 * children in a ScrollView when content may overflow the screen.
 */
interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  testID?: string;
}

export function ScreenContainer({
  children,
  scrollable = false,
  testID,
}: ScreenContainerProps) {
  const content = scrollable ? (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1" testID={testID}>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a2e] px-4">{content}</SafeAreaView>
  );
}
