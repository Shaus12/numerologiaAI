import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Typography } from '../../constants/Typography';

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
    return (
        <Text
            style={[
                Typography[variant],
                color ? { color } : {},
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};
