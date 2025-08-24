import { createRestyleComponent, createVariant, VariantProps, useTheme } from '@shopify/restyle';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Theme } from '../../theme';
import { Text } from './Box';

type ButtonProps = TouchableOpacityProps & 
  VariantProps<Theme, 'buttonVariants'> & {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const ButtonBase = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & TouchableOpacityProps,
  Theme
>([createVariant({ themeKey: 'buttonVariants' })], TouchableOpacity);

export const Button: React.FC<ButtonProps> = React.memo(({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  ...rest
}) => {
  const theme = useTheme<Theme>();

  const getTextVariant = () => {
    if (size === 'small') return 'bodySmall';
    if (size === 'large') return 'button';
    return 'button';
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') return 'primary';
    return 'white';
  };

  const getActivityIndicatorColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return theme.colors.primary;
    }
    return theme.colors.white;
  };

  return (
    <ButtonBase
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      variant={variant}
      style={[
        size === 'small' && { paddingHorizontal: 8, paddingVertical: 4, minHeight: 32 },
        size === 'large' && { paddingHorizontal: 24, paddingVertical: 16, minHeight: 56 },
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getActivityIndicatorColor()} />
      ) : (
        <Text variant={getTextVariant()} color={getTextColor()}>
          {label}
        </Text>
      )}
    </ButtonBase>
  );
});

Button.displayName = 'Button';

// Icon Button Component
type IconButtonProps = TouchableOpacityProps & {
  icon: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

export const IconButton: React.FC<IconButtonProps> = React.memo(({
  icon,
  size = 'medium',
  variant = 'ghost',
  disabled = false,
  ...rest
}) => {
  const sizeMap = {
    small: 32,
    medium: 44,
    large: 56,
  };

  const getButtonVariant = () => {
    if (variant === 'primary') return 'primary';
    if (variant === 'secondary') return 'secondary';
    return 'ghost';
  };

  return (
    <ButtonBase
      disabled={disabled}
      activeOpacity={0.7}
      variant={getButtonVariant()}
      style={[
        {
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: 999,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      {...rest}
    >
      {icon}
    </ButtonBase>
  );
});

IconButton.displayName = 'IconButton';