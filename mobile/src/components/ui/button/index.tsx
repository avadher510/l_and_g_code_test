import React from 'react';
import { Pressable, PressableProps } from 'react-native';

export const Button = React.forwardRef<any, PressableProps>(
  (props, ref) => {
    return <Pressable ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';
