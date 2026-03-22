import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

export const Text = React.forwardRef<RNText, RNTextProps>(
  (props, ref) => {
    return <RNText ref={ref} {...props} />;
  }
);

Text.displayName = 'Text';
