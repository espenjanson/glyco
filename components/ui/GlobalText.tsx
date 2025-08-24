import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

// Override the default React Native Text component to use Circular font
export const GlobalText: React.FC<RNTextProps> = ({ style, ...props }) => {
  return (
    <RNText
      {...props}
      style={[
        {
          fontFamily: 'Circular-Book',
        },
        style,
      ]}
    />
  );
};

// Export as default for easy drop-in replacement
export default GlobalText;