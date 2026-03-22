import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

export const Heading = React.forwardRef<RNText, RNTextProps>(
  (props, ref) => {
    return <RNText ref={ref} {...props} />;
  }
);

Heading.displayName = 'Heading';
