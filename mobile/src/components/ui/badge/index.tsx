import React from 'react';
import { View, ViewProps } from 'react-native';

export const Badge = React.forwardRef<View, ViewProps>(
  (props, ref) => {
    return <View ref={ref} {...props} />;
  }
);

Badge.displayName = 'Badge';
