import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../../constants/Colors';

interface GlassCardProps extends ViewProps {
    children: React.ReactNode;
    border?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    border = true,
    ...props
}) => {
    return (
        <View
            style={[
                styles.card,
                border && styles.border,
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    border: {
        borderWidth: 1,
        borderColor: Colors.surfaceBorder,
    },
});
