import React from 'react';
import { View, ViewProps } from 'react-native';

export const Divider = React.forwardRef<View, ViewProps>(
  (props, ref) => {
    return <View ref={ref} {...props} />;
  }
);

Divider.displayName = 'Divider';
