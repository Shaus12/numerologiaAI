import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { Typography } from '../../constants/Typography';
import { useSettings } from '../../context/SettingsContext';

interface MysticalTextProps extends TextProps {
    variant?: keyof typeof Typography;
    color?: string;
}

export const MysticalText: React.FC<MysticalTextProps> = ({
    children,
    variant = 'body',
    color,
    style,
    ...props
}) => {
    const { textDirection, isRTL } = useSettings();

    // Determine if the provided style has a specific textAlign
    const flatStyle = StyleSheet.flatten(style) as TextStyle;
    const hasCustomAlignment = flatStyle?.textAlign;

    return (
        <Text
            style={[
                Typography[variant],
                color ? { color } : {},
                // Apply RTL alignment unless overridden, but default to 'auto' or 'left' for English
                !hasCustomAlignment && { textAlign: textDirection },
                // Force writing direction for proper punctuation handling
                isRTL && { writingDirection: 'rtl' },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};
