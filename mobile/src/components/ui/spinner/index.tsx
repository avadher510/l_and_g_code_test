import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

export interface SpinnerProps extends ActivityIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
}

export const Spinner = React.forwardRef<ActivityIndicator, SpinnerProps>(
  ({ size = 'large', color = '#ffffff', ...props }, ref) => {
    return <ActivityIndicator ref={ref} size={size} color={color} {...props} />;
  }
);

Spinner.displayName = 'Spinner';
